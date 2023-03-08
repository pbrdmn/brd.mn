const MS_IN_HOURS = 360000;
const MS_IN_DAYS = 86400000;
const MS_IN_MONTHS = MS_IN_DAYS * 30;
const MS_IN_YEARS = MS_IN_DAYS * 365;

document.onload = liveUpDates();

function liveUpDates() {
  const els = document.querySelectorAll("time[datetime]");
  els.forEach((el) => {
    var time = new Date(el.getAttribute("datetime"));
    el.innerHTML = timeAgo(time);
  });
}

function timeAgo(time, now) {
  if (!time) return "";
  if (!now) now = new Date();

  const timeDiff = now - time;

  const years = Math.ceil(timeDiff / MS_IN_YEARS);
  if (years > 1) return `${years} years ago`;

  const months = Math.ceil(timeDiff / MS_IN_MONTHS);
  if (months > 1) return `${months} months ago`;

  const days = Math.ceil(timeDiff / MS_IN_DAYS);
  if (days > 1) return `${days} days ago`;

  return `a few hours ago`;
}
