const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (cfg) {
  cfg.addWatchTarget("./src/*.css");

  cfg.addPassthroughCopy("src/**/*.{css,gif,ico,jpg,png,txt}");

  cfg.addFilter("filterTagList", (tags) => {
    return (tags || []).filter(
      (tag) => ["all", "articles"].indexOf(tag) === -1
    );
  });

  cfg.addFilter("postDate", (dateObj) => {
    var isoDate = dateObj.toISOString();
    return isoDate.substring(0, 10);
  });

  cfg.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);

  return {
    dir: {
      input: "src",
      output: "build",
    },
  };
};
