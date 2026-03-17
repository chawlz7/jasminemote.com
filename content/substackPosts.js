const fs = require("fs");
const path = require("path");

module.exports = function() {
  try {
    const dataPath = path.join(__dirname, "substackPostsData.json");
    const posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    // Dates are stored as ISO strings; restore as Date objects for Eleventy filters
    return posts.map(post => ({ ...post, date: new Date(post.date) }));
  } catch (err) {
    console.warn(`[Substack] Could not read substackPostsData.json: ${err.message}`);
    return fallbackPosts();
  }
};

// Shown if substackPostsData.json is missing (e.g. fresh clone before first update)
function fallbackPosts() {
  return [
    {
      title: "Trigger Warnings and Mental Health",
      url: "https://jasminemote.substack.com/p/trigger-warnings-and-mental-health",
      date: new Date("2025-03-13"),
      excerpt: "From parenting Facebook groups to college classrooms, trigger warnings are everywhere and contested. A look at what the science actually says.",
      featured: true
    },
    {
      title: "Your Identity Is Not a Mental Health Risk Factor",
      url: "https://jasminemote.substack.com/p/your-identity-is-not-a-mental-health",
      date: new Date("2024-06-18"),
      excerpt: "LGBTQ+ people face real mental health disparities — but that's not the same as their identity being pathological.",
      featured: false
    },
    {
      title: "Psychology Is the Hero in Hello, Cruel World!",
      url: "https://jasminemote.substack.com/p/psychology-is-the-hero-in-melinda",
      date: new Date("2025-05-29"),
      excerpt: "Melinda Wenner Moyer's parenting book earns praise for taking both science and parents seriously — but not without honest criticism.",
      featured: false
    }
  ];
}
