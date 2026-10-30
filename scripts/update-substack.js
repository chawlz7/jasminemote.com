#!/usr/bin/env node
// Manual refresh of the Mental Healthy posts on the homepage: fetches the 3 newest Substack posts and
// writes src/content/substackPostsData.json. Normally the hourly job on Charles's Mac Studio does
// this (personalOS jobs/jasminemote_feed.py, which uses the same field mapping and commits through
// the GitHub API). Substack refuses requests from cloud build servers, so this can't run in the build.
//
// Usage:  npm run update-substack

import fs from 'node:fs';

const API_URL = 'https://jasminemote.substack.com/api/v1/posts?limit=3';
const OUT = new URL('../src/content/substackPostsData.json', import.meta.url);

const res = await fetch(API_URL, { headers: { 'User-Agent': 'jasminemote.com manual refresh' } });
if (!res.ok) {
	console.error(`[Substack] Fetch failed: ${res.status}`);
	process.exit(1);
}
const items = await res.json();

const posts = items.slice(0, 3).map((item, i) => {
	const raw = item.truncated_body_text || item.subtitle || '';
	const excerpt = raw.length > 300 ? raw.slice(0, 300).trimEnd() + '…' : raw;
	return {
		title: item.title || 'Untitled',
		url: item.canonical_url || '#',
		date: item.post_date || new Date().toISOString(),
		excerpt,
		subtitle: (item.subtitle || '').trim() || null,
		image: item.cover_image || null,
		featured: i === 0,
	};
});

fs.writeFileSync(OUT, JSON.stringify(posts, null, 2) + '\n');
console.log(`[Substack] Wrote ${posts.length} posts → src/content/substackPostsData.json`);
