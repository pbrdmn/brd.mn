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