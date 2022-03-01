module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles.css");
  eleventyConfig.addWatchTarget("./src/styles.css");
  eleventyConfig.addPassthroughCopy("src/**/*.{jpg,jpeg,png,gif}");
  eleventyConfig.addCollection("navAlpha", function(collection) {
    return collection.getFilteredByTags('nav').sort(function(a, b) {
        let nameA = a.data.title.toUpperCase();
        let nameB = b.data.title.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    });
});
  return {
    dir: {
      input: "src",
      output: "www"
    }
  }
};