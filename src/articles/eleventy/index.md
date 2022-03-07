---
title: Rebuilding with Eleventy
description: Rebuilding this personal site with a new static site generator
date: 2022-02-28
tags: [eleventy, javascript, markdown]
image: rebuilding-with-eleventy-theme.png
imageAlt: Eleventy theme with dark and light modes
---
For this simple site, I've been hosting a minimal `markdown` to `html` application to manage this personal site. As my professional software development career has moved on I haven't programmed in PHP for _years_ so it was time for this site to follow this transition and move away from PHP too. While I wanted to rebuild the site code, the underlying data for this site is managed in markdown. So ideally I would like to keep this data in markdown and only replace the html generation and also refresh the styling at the same time.

---

After some research, I decided to work with [Eleventy](https://www.11ty.dev/), which will be able to build a static site from my markdown files and also provide a quick preview mode when working on the files. With a small `.eleventy.js` config file in the root directory it can even run without installing the package itself, meaning we don't even need a bloated `node_modules` directory, by using `npx`.

After reading the documentation and watching a [short ten minute tutorial](https://www.youtube.com/watch?v=p81J7G1qFAM), my final config file looks like this:

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles.css");
  eleventyConfig.addWatchTarget("./src/styles.css");
  eleventyConfig.addPassthroughCopy("src/**/*.{jpg,jpeg,png,gif}");
  return {
    dir: {
      input: "src",
      output: "www"
    }
  }
};
```

This configuration sets input and output directories - source files are in `src` and the finished website is output at `www`, as well as identifying that we want the `./src/styles.css` file and images `*.{jpg,jpeg,png,gif}` copied to the website too.

---

Previewing the website is achieved by running eleventy with the `--serve` parameter, which runs a webserver hosting the output directory and monitors the input files for changes, which will then rebuild the website and refresh the browser.

```bash
npx @11ty/eleventy --serve
```

The website files can also be generated without reloading and previewing with:

```bash
npx @11ty/eleventy
```

Once the website is ready to be released, the static files can be copied from the output directory to a web server and the hard part is done.

---

After this, there is opportunity to explore integrating the build and publish steps into a CI/CD pipeline to be triggered by changes to a code repository, when adding or editing an article or other page.