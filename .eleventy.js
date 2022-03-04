const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/*.css");

  eleventyConfig.addPassthroughCopy("src/**/*.{css,jpg,jpeg,png,gif}");

  eleventyConfig.addCollection("navAlpha", function(collection) {
    return collection.getFilteredByTags('nav').sort(function(a, b) {
        let nameA = a.data.title.toUpperCase();
        let nameB = b.data.title.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    });
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "src",
      output: "build"
    }
  }
};