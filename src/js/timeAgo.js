document.querySelectorAll("time[datetime]").forEach((el) => {
  var date = new Date(el.getAttribute("datetime"));
  el.innerHTML = timeAgo(date);
});

function timeAgo(t, n = new Date()) {
  if (!t) return "";
  if (n.toDateString() == t.toDateString()) return "Today";

  const ms = n - t;
  const d = Math.ceil(ms / 8.64e7);
  const m = Math.floor(ms / 2.628e9);
  const y = Math.floor(ms / 3.154e10);

  if (y > 1) return `${y} years ago`;
  if (m > 1) return `${m} months ago`;
  return `${d} day${d > 1 ? "s" : ""} ago`;
}
