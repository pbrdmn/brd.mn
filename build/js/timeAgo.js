document.onload = relativeDates();

function relativeDates() {
  const els = document.querySelectorAll("time[datetime]");
  els.forEach((el) => {
    var date = new Date(el.getAttribute("datetime"));
    el.innerHTML = timeAgo(date);
  });
}

function timeAgo(time, now) {
  if (!time) return "";
  if (!now) now = new Date();

  if (
    now.getDate() == time.getDate() &&
    now.getMonth() == time.getMonth() &&
    now.getFullYear() == time.getFullYear()
  ) {
    return "Today";
  }

  const ms = now - time;
  const days = Math.ceil(ms / (86400 * 1000));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 1) return `${years} years ago`;
  if (months > 1) return `${months} months ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
