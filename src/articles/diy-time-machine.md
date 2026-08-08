---
title: DIY Time Machine
description: Hourly Btrfs & Rsync Backups for CachyOS
date: 2026-08-08
tags:
  - backup
  - btrfs
  - code
  - linux
---

I recently set up a pretty fresh installation of CachyOS on my PC to start experimenting with it. My core layout is quite fast: both the OS `/root` and my `/home` directories live on a snappy 1TB NVMe drive formatted to Btrfs, which handles my system snapshots. For bulk file storage (like my Steam library and large media), I have a separate internal 4TB HDD. 

While local snapshots on the NVMe are great for quick rollbacks, true backup discipline means getting data off the main machine entirely. I wanted to build a "Time Machine" style backup system using an external USB HDD. The goal was simple: plug the drive in, have it automatically sync hourly in the background, and maintain a strict historical archive:
* **Hourly** snapshots for 24 hours
* **Daily** snapshots for 30 days
* **Monthly** snapshots for 12 months
* **Yearly** snapshots for 7 years

Here is how I built it, the Btrfs roadblocks I hit along the way, and the final script that ties it all together.

---

## The Roadblock: Snapshots Don't Cross Drives

My initial thought was pure Btrfs: format the external USB HDD to Btrfs, and simply snapshot `/home` directly onto the external drive. 

**Spoiler alert:** Btrfs doesn't work that way. 

Btrfs subvolume snapshots are incredibly fast and efficient because they use copy-on-write (CoW) pointers on the *same* physical filesystem. They cannot span across different devices or separate Btrfs filesystems. 

### The Hybrid Solution
To mimic the Time Machine behavior across physical disks, I had to combine two of Linux's best data tools:
1. **`rsync`**: Safely mirrors `/home` over to a "live" directory on the external Btrfs drive.
2. **`btrfs subvolume snapshot`**: Instantly freezes that live external directory into a read-only snapshot right on the USB drive.

---

## Automation & Graceful Degradation

Because this is a portable USB drive, it won't always be plugged into the machine. I needed an hourly cron-like task, but a dumb script would throw a wall of errors or break things if it tried syncing to a missing drive.

The solution was integrating a smart mount-check into a system-level **Systemd Timer**. If the drive isn't there, the script exits silently. If it is there, the magic happens.

---

## The Backup & Pruning Script

Save this script to `/usr/local/sbin/home-rsync-snapshot.sh` and make it executable (`sudo chmod +x`). 

It handles the mount checks, mounts the live directory as a true Btrfs subvolume if it doesn't exist, fires the `rsync`, snapshots it, and runs a granular arithmetic cleanup loop to prune old archives without breaking during time shifts (like Daylight Saving Time).

```bash
#!/usr/bin/env bash
set -euo pipefail

USB_TOP="/mount/SeagateBackup"
DEST_CURRENT="\${USB_TOP}/@backup-home/current"
DEST_SNAPROOT="\${USB_TOP}/@backup-home/.snapshots"

# Exit silently if the USB drive is disconnected
findmnt -rno FSTYPE "\$USB_TOP" >/dev/null 2>&1 || exit 0

# Ensure destinations and subvolumes exist
mkdir -p "\((dirname "\)DEST_CURRENT")"
if [ ! -d "\$DEST_CURRENT" ]; then
  btrfs subvolume create "\$DEST_CURRENT"
fi
mkdir -p "\$DEST_SNAPROOT"

TS="\$(date +'%Y-%m-%d_%H-%M-%S')"

# Sync /home -> destination subvolume
rsync -aHAX --numeric-ids --delete --inplace --partial \
  /home/ "\${DEST_CURRENT}/"

# Create read-only snapshot of destination current
btrfs subvolume snapshot -r "\$DEST_CURRENT" "\({DEST_SNAPROOT}/home-\){TS}"

# ---------- Retention Policy Cleanup ----------
mapfile -t snaps < <(find "\$DEST_SNAPROOT" -maxdepth 1 -type d -name "home-*" | sort)

# If nothing to prune, finish
((\${#snaps[@]} > 0)) || exit 0

# Cutoffs (Epoch seconds)
now=\$(date +%s)
cutoff_hourly=\$(( now - 24 * 3600 ))       # 24 hours
cutoff_daily=\$(( now - 30 * 86400 ))       # 30 days
cutoff_monthly=\$(( now - 12 * 30 * 86400 )) # 12 months
cutoff_yearly=\$(( now - 7 * 365 * 86400 ))  # 7 years

# Define all tracking tables as Associative Strings to prevent Bash math bugs
declare -A keep_name
declare -A max_daily_epoch max_daily_name
declare -A max_monthly_epoch max_monthly_name
declare -A max_yearly_epoch max_yearly_name

# Helper: parse epoch cleanly from snapshot path string
epoch_of() {
  local name ts date_part time_part parsed_time
  name="\$(basename "\$1")"
  ts="\${name#home-}"
  
  date_part="\${ts%%_*}"
  time_part="\${ts#*_}"
  parsed_time="\({date_part}\){time_part//-/:}"
  
  date -d "\$parsed_time" +%s 2>/dev/null || echo ""
}

for p in "\${snaps[@]}"; do
  n="\((basename "\)p")"
  epoch="\((epoch_of "\)p")"
  [ -n "\$epoch" ] || continue

  # Drop snapshots older than 7 years completely
  [ "\(epoch" -ge "\)cutoff_yearly" ] || continue

  # 1) Hourly rule: Keep everything under 24 hours old
  if [ "\(epoch" -ge "\)cutoff_hourly" ]; then
    keep_name["\$n"]=1
  fi

  # 2) Daily rule: Track newest snapshot folder name per day
  day="\((date -d "@\)epoch" +%F)"
  if [ "\(epoch" -ge "\)cutoff_daily" ]; then
    prev_epoch="\({max_daily_epoch[\)day]:-}"
    if [ -z "\$prev_epoch" ] || [ "\(epoch" -gt "\)prev_epoch" ]; then
      max_daily_epoch[\(day]="\)epoch"
      max_daily_name[\(day]="\)n"
    fi
  fi

  # 3) Monthly rule: Track newest snapshot folder name per month
  month="\((date -d "@\)epoch" +%Y-%m)"
  if [ "\(epoch" -ge "\)cutoff_monthly" ]; then
    prev_epoch="\({max_monthly_epoch[\)month]:-}"
    if [ -z "\$prev_epoch" ] || [ "\(epoch" -gt "\)prev_epoch" ]; then
      max_monthly_epoch[\(month]="\)epoch"
      max_monthly_name[\(month]="\)n"
    fi
  fi

  # 4) Yearly rule: Track newest snapshot folder name per year
  year="\((date -d "@\)epoch" +%Y)"
  prev_epoch="\({max_yearly_epoch[\)year]:-}"
  if [ -z "\$prev_epoch" ] || [ "\(epoch" -gt "\)prev_epoch" ]; then
    max_yearly_epoch[\(year]="\)epoch"
    max_yearly_name[\(year]="\)n"
  fi
done

# Map tracked interval snapshots to the master keep array
for n in "\${max_daily_name[@]:-}"; do [ -n "\(n" ] && keep_name["\)n"]=1; done
for n in "\${max_monthly_name[@]:-}"; do [ -n "\(n" ] && keep_name["\)n"]=1; done
for n in "\${max_yearly_name[@]:-}"; do [ -n "\(n" ] && keep_name["\)n"]=1; done

# Delete anything not flagged for keeping
for p in "\${snaps[@]}"; do
  n="\((basename "\)p")"
  if [ -z "\({keep_name[\)n]:-}" ]; then
    btrfs subvolume delete "\$p"
  fi
done

exit 0
```

---

## Wire It Up With Systemd

Instead of messy cron tabs, Systemd units give us clean logging tools right inside `journalctl`. Because the script reads `/home` metadata and manipulates Btrfs subvolumes, we configure these as system-level tasks.

### 1. The Service File
Create `/etc/systemd/system/home-rsync-snapshot.service`:

```ini
[Unit]
Description=Hourly Btrfs Home Backup to USB
ConditionPathIsMountPoint=/mount/SeagateBackup

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/home-rsync-snapshot.sh
```

### 2. The Timer File
Create `/etc/systemd/system/home-rsync-snapshot.timer`:

```ini
[Unit]
Description=Run Btrfs Home Backup Hourly

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

### 3. Activating the Engine
Reload systemd, enable the timer on boot, and kick it off right away:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now home-rsync-snapshot.timer
```

---

## Wrapping Up

Now, every hour, Systemd wakes up, checks if the `SeagateBackup` path is active, mirrors any fresh delta data from my NVMe drive using rsync, freezes it instantly into a read-only historical point-in-time snapshot, and trims away the excess. 

If the drive is in my bag while I'm out, the task quietly skips without spamming my logs. The moment I plug it back in at my desk, the automation takes over. Peace of mind, automated.
