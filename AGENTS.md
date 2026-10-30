# jasminemote.com

Jasmine Mote's professional site: an Astro static site on Cloudflare Workers, with one small Worker
for the contact form. Her words are YAML and JSON in this repo, edited through Pages CMS.
Rebuilt October 2026 from the Eleventy site; the design system is on the canvas at
https://claude.ai/artifact/WUgFwece82zXuPCycXUaLv (Soft Modern, natural).

## Who edits what

- **Jasmine** edits her content in **Pages CMS** (`.pages.yml`, https://app.pagescms.org). Saves go
  straight to `main` and deploy in about a minute.
- **The Substack feed** (`src/content/substackPostsData.json`) is written hourly by Charles's
  personalOS job (`~/personalos/jobs/jasminemote_feed.py`) through the GitHub API. Don't hand-edit it;
  `npm run update-substack` is the manual refresh.
- **A coding agent** works on a branch and opens a PR. Cloudflare builds every branch with a preview URL.

## Her content is hers

`src/content/*.yaml` and `*.json` are Jasmine's. Always `git pull` before touching anything near them,
never overwrite her version with a local one, and never rewrite her copy. If a design needs words she
hasn't written, ask Charles; don't invent them. The schemas in `src/content.config.ts` and the forms in
`.pages.yml` must describe the same fields; change both together.

## Where things are

| What | Where |
|---|---|
| Design tokens (color, type, space, radius) | `src/styles/tokens.css`; change values only here |
| Shared styles (type roles, buttons, chips, lists) | `src/styles/global.css` |
| Page shell, `<head>`, structured data | `src/layouts/Base.astro` |
| Pages | `src/pages/*.astro` (six pages + 404), URLs unchanged from the old site |
| Components | `src/components/` (one per design-system component) |
| Content schemas | `src/content.config.ts` |
| CMS forms | `.pages.yml` |
| Brand art (vines, mark, line portrait) | `public/images/` |
| Contact form endpoint | `worker/index.ts` (POST /api/contact) |
| Security headers | `scripts/headers.mjs` (writes `dist/_headers` after the build) |
| Old-URL redirects | `public/_redirects` |

## Design rules that matter

- Purple acts, the garden supports: `--violet-600` only for links, buttons and heading accents.
- Hedvig Letters Serif has no italic; emphasis in a heading (`<em>` in her YAML) renders in violet.
- Sentence case everywhere; no uppercase letter-spaced labels. Corners: 8 fields, 16 cards, pills only
  for buttons and chips; the arch only for her portrait.
- At most three botanical moments per page, always growing from an edge, never behind text. Vine
  images carry `data-grow` and load eagerly (never `loading="lazy"`): they animate in on scroll and
  must already be there when their moment comes. They're small (16–44 KB).
- Avoid the generated-site tells (cream + serif + clay, icon-card grids, stat tiles, big radii).

## Making a change

1. `git pull`, branch, change, `npm run build` (must pass; the schemas catch content mistakes).
2. Local preview: `npm run dev`, or `npm run serve` to run the built site and Worker through Wrangler.
3. Push and open a PR; the Workers Builds check posts a preview URL.
4. Merging to `main` deploys to production. Merge only when Charles says so.

## Contact form

`/api/contact` screens bots (honeypot, minimum fill time, Turnstile once `TURNSTILE_SITE_KEY` in
`src/consts.ts` and the `TURNSTILE_SECRET` Worker secret are set) and emails `CONTACT_TO` (a Worker secret, so her address isn't in this public repo) from
`CONTACT_FROM` with Reply-To set to the sender. It needs Cloudflare Email Routing on jasminemote.com,
with `CONTACT_TO` a verified destination address. Nothing is stored.
