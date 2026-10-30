// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// jasminemote.com. Pages keep the old site's URLs (/therapy/, /research/, …) with trailing slashes,
// so links and search rankings carry over unchanged.
export default defineConfig({
	site: 'https://jasminemote.com',
	trailingSlash: 'always',
	build: { format: 'directory' },
	integrations: [sitemap()],
});
