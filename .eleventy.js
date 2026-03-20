const { DateTime } = require("luxon");
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {

  // ── YAML support for content/ data files ──────────────────────
  eleventyConfig.addDataExtension("yaml,yml", contents => yaml.load(contents));

  // ── Passthrough copy ──────────────────────────────────────────
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "public": "." });   // favicon, cv.pdf, og image, etc.

  // ── Filters ───────────────────────────────────────────────────

  // "March 2025"
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL yyyy");
  });

  // ISO string for <time datetime="...">
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  // truncate("some long string", 200)
  eleventyConfig.addFilter("truncate", (str, length) => {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + "…";
  });

  // strips HTML tags from RSS excerpts
  eleventyConfig.addFilter("stripHtml", (str) => {
    return str ? str.replace(/<[^>]*>/g, "") : "";
  });

  // slice(start, end) — JavaScript Array.prototype.slice semantics
  eleventyConfig.addFilter("slice", (arr, start, end) => {
    return arr ? arr.slice(start, end) : [];
  });

  // groupByYear — groups array of objects by `year` property, newest first
  // Returns: [{ year: 2025, items: [...] }, { year: 2024, items: [...] }, ...]
  eleventyConfig.addFilter("groupByYear", (arr) => {
    if (!arr) return [];
    const groups = {};
    for (const item of arr) {
      if (!groups[item.year]) groups[item.year] = [];
      groups[item.year].push(item);
    }
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map(year => ({ year: parseInt(year), items: groups[year] }));
  });

  // pubsByFocusArea — filters publications by focus_area id
  // Usage in template: publications | pubsByFocusArea(area.id)
  eleventyConfig.addFilter("pubsByFocusArea", (arr, id) => {
    return arr ? arr.filter(p => p.focus_area === id) : [];
  });

  // pubsChartData — builds bar chart data from publications array
  // Returns: [{ year, count, height (px, scaled to 120px max), label }]
  // Add new publications to publications.json and this updates automatically.
  eleventyConfig.addFilter("pubsChartData", (arr) => {
    if (!arr) return [];
    const counts = {};
    for (const pub of arr) {
      counts[pub.year] = (counts[pub.year] || 0) + 1;
    }
    const maxCount = Math.max(...Object.values(counts));
    return Object.keys(counts)
      .sort((a, b) => b - a)
      .map(year => ({
        year: parseInt(year),
        count: counts[year],
        height: Math.max(8, Math.round((counts[year] / maxCount) * 120)),
        label: counts[year] === 1 ? "1 publication" : `${counts[year]} publications`
      }));
  });

  // ── Config ────────────────────────────────────────────────────
  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "content"        // was _data — renamed for clarity
    }
  };
};
