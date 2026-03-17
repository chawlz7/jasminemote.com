# jasminemote.com — Project README

> **Status:** Site complete. All 6 pages built and deployed. Contact form live (Web3Forms). Pending: favicon, CV PDF, OG image, DNS cutover, content review.

---

## Project Overview

This is a redesign and rebuild of [jasminemote.com](https://jasminemote.com), the professional website of Jasmine Mote, PhD — a licensed clinical psychologist, researcher at Boston University, and writer. The site is built from scratch as a custom static site, replacing a bare WordPress.com theme.

**The through-line of the site:** Jasmine is a researcher, a therapist, and a writer, and all three roles are mutually reinforcing. The site communicates that coherently rather than treating each role as a separate identity.

---

## Goals (in rough priority order)

1. **Attract therapy clients** — `/therapy/` page details her practice; `/work-with-me/` funnels potential clients to CPG
2. **Grow the Substack** (*Mental Healthy*) — newsletter is front and center on the homepage; subscriber CTA prominent
3. **Establish academic credibility** — publications list, BU affiliation, research overview
4. **General professional polish** — custom visual identity replacing the generic WordPress theme

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Static site generator | [Eleventy (11ty)](https://www.11ty.dev) v3 | Templates in Nunjucks (`.njk`) |
| CI/CD | GitHub Actions | Builds on push to main + daily 6am UTC cron |
| Hosting | GitHub Pages | Free on public repos; custom domain support |
| Source control | GitHub | Jasmine edits content files in-browser |
| Newsletter | [Substack](https://jasminemote.substack.com) | RSS fetched at build time |
| Contact form | [Web3Forms](https://web3forms.com) | Free tier; access key in `content/workWithMe.yaml` |
| Fonts | Google Fonts | Playfair Display + DM Sans |
| CSS | Hand-rolled, no framework | CSS custom properties throughout |

**Why this stack:**
- Jasmine is comfortable editing YAML/JSON files but doesn't want to touch code or a CMS admin UI
- GitHub's in-browser file editor is sufficient for her update cadence (bio, publications, writing credits)
- Substack posts surface automatically via RSS — zero maintenance
- GitHub Actions + Pages is fully free on a public repo (vs Netlify free tier which caps at 300 build minutes/month — insufficient for daily scheduled rebuilds)
- No separate hosting account to manage; everything lives in GitHub

---

## Design System

**Palette** — derived from the *Mental Healthy* Substack logo (indigo/violet + botanical illustration style):

```css
--bg:         #F8F5F0;   /* warm off-white, main background */
--bg-section: #F0EDE8;   /* slightly darker, alternate sections */
--ink:        #1A1814;   /* near-black body text */
--ink-mid:    #4A4640;   /* secondary text */
--ink-light:  #948E86;   /* meta text, captions */
--accent:     #4B3D8F;   /* indigo — primary accent, CTAs */
--accent-lt:  #7B6EC0;   /* lighter indigo — decorative dots etc */
--accent-bg:  #EDEAF8;   /* indigo tint — hover states, tags */
--rule:       #DDD8D0;   /* borders, dividers */
```

**Typography:**
- Display/headings: `Playfair Display` (serif) — italic variant used decoratively in headlines
- Body/UI: `DM Sans` (weight 300 for body, 500 for labels/caps)
- No system fonts anywhere

**Aesthetic direction:** Editorial/magazine — think an independent publication, not a therapy directory listing. Generous whitespace, strong typographic hierarchy, card-based content grids, minimal decoration.

**Key design patterns:**
- Section headers: serif title left + small-caps link right, separated by a rule
- Content grids: `gap: 1.5px; background: var(--rule)` creates a hairline-divided grid from white cards
- Italic serif in headlines: used selectively for emphasis (e.g. "the *science* of how they feel")
- Inner pages: `.page-header` section with eyebrow, serif headline, subhead; then content sections below

---

## Project Structure

```
jasminemote.com/
├── .eleventy.js              # Eleventy config, custom filters
├── .github/
│   └── workflows/
│       └── build.yml         # GitHub Actions: build + deploy on push + daily cron
├── package.json
├── .gitignore
│
├── index.njk                 # Homepage ✅
├── research/
│   └── index.njk             # Research page ✅
├── writing/
│   └── index.njk             # Writing & Press page ✅
├── resources/
│   └── index.njk             # Resources page ✅
├── therapy/
│   └── index.njk             # Therapy page ✅
├── work-with-me/
│   └── index.njk             # Work With Me page ✅
│
├── _includes/
│   └── layouts/
│       └── base.njk          # Shared shell: <head>, nav, footer
│
├── content/                  # Global data — auto-available in all templates
│   ├── homepage.yaml         # ← Jasmine edits: homepage text & credentials
│   ├── research.yaml         # ← Jasmine edits: research statement, stats, focus areas
│   ├── writingPage.yaml      # ← Jasmine edits: writing page header + newsletter callout
│   ├── resources.yaml        # ← Jasmine edits: PhD guide link + all resource lists
│   ├── workWithMe.yaml       # ← Jasmine edits: Work With Me page text + Formspree endpoint
│   ├── publications.json     # ← Jasmine edits: add new publications here
│   ├── writing.json          # ← Jasmine edits: add new articles and press clips here
│   └── substackPosts.js      # Fetches RSS at build time; fallback posts if offline
│
├── public/                   # Static assets copied to site root
│   ├── CNAME                 # jasminemote.com — keeps custom domain on redeploy
│   └── jasmine-headshot.png  # Headshot photo
│
└── src/
    ├── css/
    │   └── main.css          # All styles (no preprocessor)
    └── js/
        └── main.js           # Mobile nav toggle only
```

**Eleventy output:** `_site/` (gitignored, rebuilt by GitHub Actions on deploy)

---

## Site Architecture

| URL | Template | Status | Notes |
|---|---|---|---|
| `/` | `index.njk` | ✅ Built | Full homepage |
| `/research/` | `research/index.njk` | ✅ Built | Publications, bar chart, focus areas |
| `/writing/` | `writing/index.njk` | ✅ Built | Essays & press from `writing.json` |
| `/resources/` | `resources/index.njk` | ✅ Built | PhD guide + MA mental health resources |
| `/therapy/` | `therapy/index.njk` | ✅ Built | Specialties, CPG intake CTA |
| `/work-with-me/` | `work-with-me/index.njk` | ✅ Built | Two paths: therapy (CPG + Psychology Today) + collaboration contact form |

---

## Eleventy Config Notes

**Custom filters** (defined in `.eleventy.js`):

| Filter | Usage | Description |
|---|---|---|
| `postDate` | `date \| postDate` | Formats a JS Date as "March 2025" |
| `isoDate` | `date \| isoDate` | ISO string for `<time datetime="...">` |
| `truncate(n)` | `str \| truncate(200)` | Truncates string to n chars with ellipsis |
| `stripHtml` | `str \| stripHtml` | Strips HTML tags (used on RSS excerpts) |
| `slice(start, end)` | `arr \| slice(0, 6)` | Array slice — used to limit homepage writing cards |
| `groupByYear` | `publications \| groupByYear` | Groups pub array by year → `[{ year, items }]` newest first |
| `pubsChartData` | `publications \| pubsChartData` | Builds bar chart data scaled to 120px max height |

**Global data files** (auto-available in all templates as the variable name matching the filename):

| Variable | File | Contents |
|---|---|---|
| `homepage` | `content/homepage.yaml` | All homepage editable text |
| `research` | `content/research.yaml` | Research statement, stats, focus areas |
| `writingPage` | `content/writingPage.yaml` | Writing page header + newsletter callout |
| `resources` | `content/resources.yaml` | PhD guide + MA resource lists |
| `workWithMe` | `content/workWithMe.yaml` | Work With Me page text + Formspree endpoint |
| `publications` | `content/publications.json` | Array of 30+ publications |
| `writing` | `content/writing.json` | Array of writing articles + press items |
| `substackPosts` | `content/substackPosts.js` | 3 most recent Substack posts (RSS fetch) |

**Passthrough copy:**
- `src/css/` → `_site/css/`
- `src/js/` → `_site/js/`
- `public/` → `_site/` (use for favicon, og images, cv.pdf, robots.txt etc.)

---

## Substack RSS Integration

**Feed URL:** `https://jasminemote.substack.com/feed`

Fetched in `content/substackPosts.js` at build time using `node-fetch` and `fast-xml-parser`. Returns an array of the 3 most recent posts. If the fetch fails (network unavailable, Substack down), falls back to hardcoded recent posts so the build never breaks.

Each post object:
```js
{
  title: "Post title",
  url: "https://jasminemote.substack.com/p/...",
  date: Date object,
  excerpt: "Post subtitle (from RSS description field — the subtitle Jasmine sets per post in Substack)",
  image: "https://substackcdn.com/...",  // from RSS <enclosure> tag; null if absent
  featured: true   // only the first post
}
```

**Image source:** The RSS `<enclosure>` tag provides the cover image URL for each post (served via Substack's CDN). This is the same image shown at the top of the post on Substack.

**Scheduled rebuilds:** GitHub Actions runs a daily 6am UTC cron build so new Substack posts appear without manual intervention. Jasmine can also trigger a manual rebuild from the Actions tab → "Build and Deploy" → "Run workflow".

---

## Content Jasmine Can Edit (No Code Required)

All content files live in `content/`. Open any file in GitHub's browser editor, make changes, and commit — the site rebuilds automatically in about a minute.

---

### Homepage text — `content/homepage.yaml`

Controls all major text on the homepage: hero headline and bio, credential cards, newsletter intro, about section body and pullquote, therapy section. The file has comments explaining every field.

---

### Research page — `content/research.yaml`

Controls the research statement (eyebrow, headline, body, affiliation), the three stats cells, and the six focus area cards.

```yaml
stats:
  - number: "30+"
    label: "Peer-reviewed publications"
```

```yaml
focus_areas:
  - title: "Schizophrenia & Psychosis Spectrum"
    description: "..."
```

---

### Publications — `content/publications.json`

Add a new object to the **top** of the array (newest first):

```json
{
  "year": 2026,
  "authors": "Mote, J., & Collaborator, A.",
  "title": "Title of the paper.",
  "journal": "Journal Name, vol(issue), pages.",
  "url": "https://doi.org/..."
}
```

Leave `"url": ""` if no public link yet. The publications bar chart updates automatically when new entries are added.

---

### Writing & Press — `content/writing.json`

Add a new writing article:
```json
{
  "category": "writing",
  "source": "Publication Name",
  "title": "Article title",
  "url": "https://..."
}
```

Add a new press/media item:
```json
{
  "category": "press",
  "source": "Outlet Name",
  "title": "Article or segment title",
  "url": "https://...",
  "date": "Month Year",
  "note": "Interview"
}
```

Leave `"url": ""` and add `"note": "description"` for items without a public link.

---

### Writing page text — `content/writingPage.yaml`

Controls the page header (eyebrow, headline, subhead) and the newsletter callout box (kicker, headline, body text, Substack URL, button label). Update this if the newsletter description changes.

---

### Resources — `content/resources.yaml`

Controls the PhD guide callout (update the `url` field when the guide moves) and both resource lists. To add a resource:

```yaml
early_psychosis:          # or general_mental_health
  - name: "Program Name"
    detail: "Location or descriptor"
    url: "https://..."
```

---

### Work With Me — `content/workWithMe.yaml`

Controls all text on the `/work-with-me/` page, plus the CPG and Psychology Today profile URLs.

The contact form uses [Web3Forms](https://web3forms.com) and is fully active. Submissions go to `jasmine.mote@gmail.com`. The access key is stored as `collaboration.web3forms_key`.

To change the destination email, log in at web3forms.com and update the email address on the account.

---

## Deployment Setup

**Platform: GitHub Actions + GitHub Pages (public repo, free tier)**

Chosen over Netlify because: Netlify's free tier caps at 300 build minutes/month, which a daily scheduled rebuild plus dev pushes would exhaust. GitHub Actions gives 2,000 free minutes/month on public repos — effectively unlimited for this site.

### One-time setup (already done)

1. **GitHub repo** — public repo, GitHub Pages enabled under Settings → Pages → Source: "GitHub Actions"
2. **Custom domain** — Settings → Pages → Custom domain → `jasminemote.com`
   - `public/CNAME` file contains `jasminemote.com` — preserves custom domain across deploys
3. **DNS** — `A` records at registrar pointing to GitHub Pages IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   Plus `CNAME`: `www` → `[username].github.io`
4. **HTTPS** — Settings → Pages → Enforce HTTPS (available once DNS propagates)

### How deploys work

- **On every push to `main`** — Actions builds and deploys automatically (~1 min)
- **Daily at 6am UTC** — scheduled build picks up new Substack posts
- **Manual trigger** — Actions tab → "Build and Deploy" → "Run workflow"

---

## Assets Needed

| Asset | Status | Notes |
|---|---|---|
| Headshot / photo | ✅ Added | `public/jasmine-headshot.png` |
| Contact form | ✅ Live | Web3Forms, sends to jasmine.mote@gmail.com |
| Google Scholar | ✅ Linked | Real URL in `research/index.njk` |
| ResearchGate | ✅ Linked | Real URL in `research/index.njk` |
| Favicon | ❌ Missing | Drop file into `public/` (suggest creating from Mental Healthy logo or initials) |
| CV PDF | ❌ Missing | Drop `cv.pdf` into `public/` — already linked from Research page |
| OG image | ❌ Missing | 1200×630px social sharing image; drop into `public/` |
| DOI URLs for publications | ❌ Mostly empty | Fill in `"url"` fields in `content/publications.json` |

---

## Key Design Decisions

Decisions made during the initial build (Claude Code, March 2026):

- **Platform:** Static site (Eleventy + GitHub Pages) over WordPress, Squarespace, or Webflow. Jasmine comfortable with file editing; GitHub in-browser editor is sufficient for her update cadence.
- **Newsletter first:** Jasmine agreed the Substack should be front and center. Homepage leads with it. *Mental Healthy* is the site's heartbeat — jasminemote.com is built around it, not the other way around.
- **RSS fetch at build time** (not client-side) for cleaner page loads, no CORS concerns, no flash of empty cards. Daily GitHub Actions cron rebuild keeps it fresh.
- **Color palette derived from Mental Healthy logo** — indigo/violet pulled from the Substack branding so site and newsletter feel like the same brand family.
- **Work With Me replaces a standalone Contact page** — therapy clients are routed to CPG and Psychology Today; all other inquiries go through the Web3Forms contact form on the same page.
- **Content in YAML/JSON, not templates** — all page text Jasmine might want to update lives in `content/` files she can edit in GitHub's browser without touching any template code.
- **Publications bar chart is fully automatic** — adding a new pub to `publications.json` updates the chart and year groupings with no template changes needed.
- **Substack post images via RSS enclosure** — each post card on the homepage shows the post's cover image, pulled from the `<enclosure>` tag in the RSS feed. No manual maintenance required; images update automatically with each build.
- **Editorial post grid layout** — newsletter section uses a `7fr 4fr` two-column grid: featured post spans both rows on the left (large image + title + subtitle), two supporting posts stack on the right (each with image + title). Cards are visually separated with individual borders and gap spacing rather than hairline-divided.
- **Substack subtitle as excerpt** — the `description` RSS field (which maps to the post subtitle Jasmine sets in Substack) is used as the excerpt on the featured card, rather than the raw start of the article body.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server with live reload
npm start
# → http://localhost:8080

# Production build
npm run build
# → output in _site/
```

**Note:** The Substack RSS fetch will fail in local dev if you're offline or if Substack's feed blocks the request. The fallback posts will be used automatically — this is expected behavior and fine for local work.

---

## Pending / Refinement Items

The site is structurally complete and the contact form is live. Remaining tasks are assets, DNS, and content refinement.

### High priority
- [ ] **DNS cutover** — point `jasminemote.com` to GitHub Pages IPs; confirm registrar (may be WordPress.com controlled)
- [ ] **Add CV PDF** — drop `cv.pdf` into `public/`; already linked from the Research page header and bottom
- [ ] **Content review** — Jasmine reads all page copy and submits edits via the GitHub browser editor

### Medium priority
- [ ] **Add favicon** — create from Mental Healthy logo or an initials lockup; drop any standard favicon file into `public/`
- [ ] **Add OG/social image** — 1200×630px image for social sharing previews; drop into `public/` and add `<meta property="og:image">` tags to `_includes/layouts/base.njk`
- [ ] **Fill in DOI URLs** — add `"url"` fields to entries in `content/publications.json` so publications link out to their papers

### Low priority / nice to have
- [ ] **Professional headshot** — current photo works; a dedicated professional session would upgrade it further
- [ ] **Test contact form** — send a test submission from the live site to confirm Web3Forms delivery to jasmine.mote@gmail.com
