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

  const days = Math.ceil((now - time) / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 1) return `${years} years ago`;
  if (months > 1) return `${months} months ago`;
  return `${days} days ago`;
}
