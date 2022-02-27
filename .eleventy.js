module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles.css");
  eleventyConfig.addWatchTarget("./src/styles.css");
  eleventyConfig.addPassthroughCopy("./src/*/*.png");
  eleventyConfig.addWatchTarget("./src/*/*.png");
  eleventyConfig.addPassthroughCopy("./src/*.jpg");
  eleventyConfig.addWatchTarget("./src/*.jpg");
  return {
    dir: {
      input: "src",
      output: "www"
    }
  }
};