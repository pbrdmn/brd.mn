const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  cfg.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "src",
      output: "build"
    }
  }
};