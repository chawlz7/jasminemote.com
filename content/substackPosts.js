const fetch = require("node-fetch");
const { XMLParser } = require("fast-xml-parser");

module.exports = async function() {
  const FEED_URL = "https://jasminemote.substack.com/feed";
  const POST_COUNT = 3;

  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "jasminemote.com site build" }
    });

    if (!response.ok) {
      console.warn(`[RSS] Feed fetch failed: ${response.status}`);
      return fallbackPosts();
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const result = parser.parse(xml);
    const items = result?.rss?.channel?.item ?? [];

    const posts = items.slice(0, POST_COUNT).map((item, i) => {
      const rawExcerpt = item["content:encoded"] || item.description || "";
      const stripped = rawExcerpt.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      const excerpt = stripped.length > 200
        ? stripped.slice(0, 200).trimEnd() + "…"
        : stripped;

      return {
        title: item.title || "Untitled",
        url: item.link || "#",
        date: item.pubDate ? new Date(item.pubDate) : new Date(),
        excerpt,
        featured: i === 0
      };
    });

    console.log(`[RSS] Fetched ${posts.length} posts from Substack`);
    return posts;

  } catch (err) {
    console.warn(`[RSS] Error fetching feed: ${err.message}`);
    return fallbackPosts();
  }
};

// Shown if the feed is unreachable at build time (e.g. local dev offline)
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
