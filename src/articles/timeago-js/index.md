---
title: Displaying Relative Time for a Static Site
description: Calculating relative dates in JS to display on statically generated sites, like eleventy
image: age-barros-rBPOfVqROzY-unsplash.webp
thumb: thumb.webp
imageAlt: Watch face with complications showing the time
date: 2023-03-09
tags:
  - javascript
  - time
  - eleventy
  - code
---
Recently I was looking to make the article dates a little simpler to see how recently they had been written. Rather than looking at timestamp or date, I wanted to see now many days, months, or years ago an article was. This looked like relatively simple problem to tackle and I could have imported an `npm` package and been done with it, but where is the fun in that?

Instead I began writing a function which calculated the difference between two javascript `Date()` objects, which would then by transformed into some discrete time periods with the power of **math**, then display the largest useful time period in the format of `{X} {periods} ago`.

## Calculating the Relative Time

Calculating the time difference between the two instances of the `Date()` class by subtraction gives a difference in milliseconds (`ms` below). This is converted to `days` by dividing by the number of milliseconds per day, then transformed to values for `months` and `years` by dividing `days` by `30` and `365` respectively.

```javascript
  var now = new Date();
  const ms = now - dateObj;
  const days = Math.ceil(ms / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
```

Once we have calculated each of the time periods we are interested in, we can `switch` between which time period to display and return a formatted string showing a human-readable time difference between the two dates given.

```javascript
    if (years > 1) return `${years} years ago`;
    if (months > 1) return `${months} months ago`;
    return `${days} days ago`;
```

With this in place, we can now calculate how old a date is in days, months, and years. In our `switch` statement, we are checking that `years` and `months` are greater than `1` which means we do not need to consider pluralisation for these labels. For `days`, we could apply a pluralisation if the `days` has a value greater than `1`.

This was all put assembled into a function as a filter in the `.eleventy.js` configuration file.

```javascript
  cfg.addFilter("timeAgo", (dateObj) => {
    var now = new Date();
    const days = Math.ceil((now - dateObj) / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 1) return `${years} years ago`;
    if (months > 1) return `${months} months ago`;
    return `${days} days ago`;
  });
```

Implementing this function within the `.eleventy.js` file as a filter meant that within an template, we could format the article's date by applying this filter.

```text
  Published {% raw %}{{ page.date | timeAgo }}{% endraw %}
```

And during the eleventy build step, the page will output

```text
  Published 1 days ago
```

---

## Hitting a Roadblock

This is where I ran into my first roadblock.

Eleventy has been _serving_ my needs perfectly well for several months, since [rebuilding my site with Eleventy](/articles/eleventy/) last year, but my code was only run during the build step, which means any changes are only updated to the site when it is deployed.

> With a statically generated site, a post that shows a publication time of `1 days ago` would continue to display this until the next article was written causing the site to be rebuilt and republished.

This did not seem to solve my problem as it is often months between writing new articles. There are workarounds, like using a cron task to trigger a rebuild every day, but that would be wasteful. Instead of using this function within the template, I needed to move the script into the browser to be run on page load.

---

## Making Relative Dates Dynamic

We will need to refactor our function and move it to a new file to publish at `/js/timeAgo.js` and add a reference to this file from the `_header` template to include it on each page of the site once it's published.

```html
  <script src="/js/timeAgo.js" defer></script>
```

This also needed to be published in the `.eleventy.js` config, here I'm publishing the whole `/js/` directory, even though there's only one file required at the moment.

```javascript
  cfg.addPassthroughCopy("src/js/*.*");
```

Within the `timeAgo.js` file we have three things to accomplish.

1. Running our script when the page loads
2. Find all of the dates on the page
3. Replacing the date with the relative time

Covering each of these items in _reverse_ order.

### 3. Replacing the date with the relative time

We can lift most of our logic from the previous `timeAgo` filter function into our new file, while here, we can also take an optional second date to make testing easier.

```javascript
function timeAgo(time, now) {
  if (!now) now = new Date();

  const ms = now - time;
  const days = Math.ceil(ms / (86400 * 1000));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 1) return `${years} years ago`;
  if (months > 1) return `${months} months ago`;
  return `${days} days ago`;
}
```

This function will take a `Date()` object as the first argument (and an optional second argument to override the `new Date()` for testing) and return a formatted relative time string.

### 2. Find all of the dates on the page

There is a piece of setup required here. In our template file, we want to generate some HTML code that gives a clean way to find where in the page to render the relative times, but we also need the dates available as input for function.

We can use `<time />` HTML tags as our placeholder and we can use the `datetime` attribute to hold the source dates. Inside the tag, we can display the static article date, which will be overwritten with the string returned from the `timeAgo` function.

```mustache
{% raw %}<time datetime="{{article.data.date}}">{{ article.data.date | postDate }}</time>{% endraw %}
```

With these dates now well structured, the code to find and replace each on the page is covered in this `relativeDates` function. We first query for all `time` elements which have the `datetime` attribute, then for each of these we parse the date and replace the contents of the element with the formatted `timeAgo` string.

```javascript
function relativeDates() {
  const els = document.querySelectorAll("time[datetime]");
  els.forEach((el) => {
    var date = new Date(el.getAttribute("datetime"));
    el.innerHTML = timeAgo(date);
  });
}
```

### 1. Running our script when the page loads

With these other changes in place we need to trigger our `relativeDates()` function to run when the pages is loaded, which can be achieved with:

```javascript
document.onload = relativeDates();
```

---

## Bringing it all together

With our change to the template including our script

```html
  <script src="/js/timeAgo.js" defer></script>
```

And marking up our templates with a structured `time` tag.

```mustache
{% raw %}<time datetime="{{article.data.date}}">{{ article.data.date | postDate }}</time>{% endraw %}
```

And the full `timeAgo.js` file now contains the three requirements listed above

```javascript
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

  const ms = now - time;
  const days = Math.ceil(ms / (86400 * 1000));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 1) return `${years} years ago`;
  if (months > 1) return `${months} months ago`;
  return `${days} days ago`;
}
```

## Bonus "Today"

As an added bonus, we can add a quick check to our `timeAgo` function to check if the article date is "Today" and return this

```javascript
  if (
    now.getDate() == time.getDate() &&
    now.getMonth() == time.getMonth() &&
    now.getFullYear() == time.getFullYear()
  ) {
    return "Today";
  }
```