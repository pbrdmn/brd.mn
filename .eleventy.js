const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const CleanCSS = require("clean-css");

module.exports = function (cfg) {
  cfg.addPassthroughCopy("{css,images,js}/*.*");
  cfg.addPassthroughCopy("**/*.{htaccess,gif,ico,jpg,png,pdf,txt,webp}");
  cfg.addPassthroughCopy("_redirects");

  cfg.addFilter("filterTagList", (tags) =>
    (tags || []).filter((tag) => ["all", "articles"].indexOf(tag) === -1)
  );
  cfg.addNunjucksFilter("limit", (arr, limit, offset) =>
    arr.slice(offset || 0, limit)
  );
  cfg.addFilter("postDate", (dateObj) =>
    dateObj.toISOString().substring(0, 10)
  );
  cfg.addFilter("cssmin", (code) => new CleanCSS({}).minify(code).styles);

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);
};
