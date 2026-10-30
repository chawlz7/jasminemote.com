// After `astro build`: write dist/_headers with the site's security headers. Cloudflare serves them
// with every static file. The Content-Security-Policy allows only the inline scripts this build
// actually contains (by SHA-256 hash), our own files, and the named third parties: Google Fonts,
// Substack's image CDN (post covers), and Cloudflare Turnstile (the contact form).
// Add a host here when a new third party is added to the site.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');

function htmlFiles(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? htmlFiles(p) : e.name.endsWith('.html') ? [p] : [];
	});
}

const hashes = new Set();
for (const file of htmlFiles(dist)) {
	const html = fs.readFileSync(file, 'utf8');
	for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
		const [, attrs, body] = m;
		if (/\bsrc\s*=/i.test(attrs) || /type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs) || !body.trim()) continue;
		hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
	}
}

const csp = [
	`default-src 'self'`,
	`script-src 'self' ${[...hashes].sort().join(' ')} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
	`style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
	`font-src 'self' https://fonts.gstatic.com`,
	`img-src 'self' data: https://substackcdn.com https://substack-post-media.s3.amazonaws.com`,
	`connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com`,
	`frame-src https://challenges.cloudflare.com`,
	`form-action 'self'`,
	`base-uri 'self'`,
	`frame-ancestors 'none'`,
	`object-src 'none'`,
].join('; ');

const headers = `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY

/images/*
  Cache-Control: public, max-age=2592000

/logos/*
  Cache-Control: public, max-age=2592000
`;
fs.writeFileSync(path.join(dist, '_headers'), headers);
console.log(`headers: wrote dist/_headers (${hashes.size} inline script hash${hashes.size === 1 ? '' : 'es'})`);
