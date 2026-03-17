#!/usr/bin/env node
// Fetches the 3 most recent Substack posts and writes them to
// content/substackPostsData.json, which is committed to the repo.
// Run locally (not in GitHub Actions) to update the site's newsletter cards.
//
// Usage:  node scripts/update-substack.js
//         npm run update-substack

const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function main() {
  const API_URL = "https://jasminemote.substack.com/api/v1/posts?limit=3";

  const response = await fetch(API_URL, {
    headers: { "User-Agent": "jasminemote.com site build" }
  });

  if (!response.ok) {
    console.error(`[Substack] Fetch failed: ${response.status}`);
    process.exit(1);
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
      date: item.post_date || new Date().toISOString(),
      excerpt,
      image: item.cover_image || null,
      featured: i === 0
    };
  });

  const outputPath = path.join(__dirname, "../content/substackPostsData.json");
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2) + "\n");
  console.log(`[Substack] Wrote ${posts.length} posts → content/substackPostsData.json`);
}

main().catch(err => {
  console.error(`[Substack] Error: ${err.message}`);
  process.exit(1);
});
