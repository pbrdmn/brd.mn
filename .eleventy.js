const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const CleanCSS = require("clean-css");

module.exports = function (cfg) {
  cfg.addWatchTarget("./src/*.css");

  cfg.addPassthroughCopy("src/**/*.{css,gif,ico,jpg,png}");

  cfg.addCollection("navAlpha", function(collection) {
    return collection.getFilteredByTags('nav').sort(function(a, b) {
        let nameA = a.data.title.toUpperCase();
        let nameB = b.data.title.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    });
  });

  cfg.addFilter('postDate', (dateObj) => {
    var isoDate = dateObj.toISOString()
    return isoDate.substring(0, 10);
  })

  cfg.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);

  
  cfg.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  return {
    dir: {
      input: "src",
      output: "build"
    }
  }
};