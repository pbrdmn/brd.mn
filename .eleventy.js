const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const CleanCSS = require("clean-css");

module.exports = function (cfg) {
  cfg.addWatchTarget("./src/*.css");

  cfg.addPassthroughCopy(
    "src/**/*.{htaccess,css,gif,ico,jpg,png,pdf,txt,webp}"
  );
  cfg.addPassthroughCopy("src/_redirects");

  cfg.addFilter("filterTagList", (tags) => {
    return (tags || []).filter(
      (tag) => ["all", "articles"].indexOf(tag) === -1
    );
  });

  cfg.addFilter("postDate", (dateObj) => {
    var isoDate = dateObj.toISOString();
    return isoDate.substring(0, 10);
  });

  cfg.addFilter("timeAgo", (dateObj) => {
    var now = new Date();
    const days = Math.ceil((now - dateObj) / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 1) return `${years} years ago`;
    if (months > 1) return `${months} months ago`;
    return `${days} days ago`;
  });

  cfg.addNunjucksFilter("limit", (arr, limit, offset) => {
    return arr.slice(offset || 0, limit);
  });

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);

  cfg.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  return {
    dir: {
      input: "src",
      output: "build",
    },
  };
};
