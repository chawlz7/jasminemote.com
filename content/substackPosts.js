const fetch = require("node-fetch");

module.exports = async function() {
  const API_URL = "https://jasminemote.substack.com/api/v1/posts?limit=3";

  try {
    const response = await fetch(API_URL, {
      headers: { "User-Agent": "jasminemote.com site build" }
    });

    if (!response.ok) {
      console.warn(`[Substack] API fetch failed: ${response.status}`);
      return fallbackPosts();
    }

    const items = await response.json();

    const posts = items.slice(0, 3).map((item, i) => {
      const rawExcerpt = item.truncated_body_text || item.subtitle || "";
      const excerpt = rawExcerpt.length > 300
        ? rawExcerpt.slice(0, 300).trimEnd() + "…"
        : rawExcerpt;

      return {
        title: item.title || "Untitled",
        url: item.canonical_url || "#",
        date: item.post_date ? new Date(item.post_date) : new Date(),
        excerpt,
        image: item.cover_image || null,
        featured: i === 0
      };
    });

    console.log(`[Substack] Fetched ${posts.length} posts from API`);
    return posts;

  } catch (err) {
    console.warn(`[Substack] Error fetching posts: ${err.message}`);
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
