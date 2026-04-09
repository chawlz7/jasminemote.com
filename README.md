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
| Newsletter | [Substack](https://jasminemote.substack.com) | Committed JSON file, updated by Mac Mini cron |
| Contact form | [Web3Forms](https://web3forms.com) | Free tier; access key in `content/workWithMe.yaml` |
| Fonts | Google Fonts | Playfair Display + DM Sans |
| CSS | Hand-rolled, no framework | CSS custom properties throughout |

**Why this stack:**
- Jasmine is comfortable editing YAML/JSON files but doesn't want to touch code or a CMS admin UI
- GitHub's in-browser file editor is sufficient for her update cadence (bio, publications, writing credits)
- Substack posts are committed as a JSON file and updated daily by a Mac Mini cron job — Substack blocks HTTP requests from GitHub Actions runners (Azure IPs), so fetching at build time isn't viable
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
- Accent color in section headings: `<em>word</em>` inside a `.section-title` renders in `--accent` (indigo), no italic. To also add italic, use `<em><i>word</i></em>`.
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
│   ├── therapy.yaml          # ← Jasmine edits: Therapy page text, specialties, CPG URL
│   ├── workWithMe.yaml       # ← Jasmine edits: Work With Me page text + Formspree endpoint
│   ├── publications.json     # ← Jasmine edits: add new publications here
│   ├── writing.json          # ← Jasmine edits: add new articles and press clips here
│   ├── substackPosts.js      # Reads substackPostsData.json; fallback posts if file missing
│   └── substackPostsData.json  # ← Committed JSON of 3 most recent Substack posts (updated by cron)
│
├── scripts/
│   ├── update-substack.js    # Fetches Substack JSON API locally; writes substackPostsData.json
│   └── update-and-push.sh   # Shell script: fetch + commit + push (runs on Mac Mini or any machine)
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
| `therapy` | `content/therapy.yaml` | Therapy page text, specialties list, CPG URL |
| `workWithMe` | `content/workWithMe.yaml` | Work With Me page text + Formspree endpoint |
| `publications` | `content/publications.json` | Array of 30+ publications |
| `writing` | `content/writing.json` | Array of writing articles + press items |
| `substackPosts` | `content/substackPosts.js` | 3 most recent Substack posts (reads from committed `substackPostsData.json`) |

**Passthrough copy:**
- `src/css/` → `_site/css/`
- `src/js/` → `_site/js/`
- `public/` → `_site/` (use for favicon, og images, cv.pdf, robots.txt etc.)

---

## Substack Integration

### Architecture: committed JSON, not fetched at build time

Substack actively blocks HTTP requests from GitHub Actions runners (Azure datacenter IPs). Both the RSS feed (`/feed`) and the JSON API (`/api/v1/posts`) return 403 or 404 from those IPs — proxy services (e.g. ScraperAPI) are also detected and blocked. **Fetching Substack data at build time is not viable from GitHub Actions.**

**Solution:** The Substack post data is committed directly to the repo as `content/substackPostsData.json`. The build just reads that file — no network call required. A cron job on a local Mac Mini fetches the data and pushes any changes, which triggers a new GitHub Pages build.

### How it works

1. **Mac Mini cron** — runs `scripts/update-and-push.sh` daily at 8:10am (10 min after Jasmine's typical 8am Substack publish time)
2. The script calls `node scripts/update-substack.js`, which fetches `https://jasminemote.substack.com/api/v1/posts?limit=3` from a residential IP (not blocked)
3. If the posts have changed, it commits `content/substackPostsData.json` and pushes to `main`
4. GitHub Actions picks up the push and rebuilds the site (~1 min)
5. If posts haven't changed, the script exits silently with no commit

### Running manually

```bash
# Fetch latest posts and push (if changed)
bash scripts/update-and-push.sh

# Or just fetch and write the JSON without pushing
npm run update-substack
```

Anyone with repo access can run `scripts/update-and-push.sh` to force a post refresh — including Jasmine from her own machine.

### Post data format

Each entry in `content/substackPostsData.json`:
```json
{
  "title": "Post title",
  "url": "https://jasminemote.substack.com/p/...",
  "date": "2025-03-01T12:00:00.000Z",
  "excerpt": "Truncated body text or subtitle from Substack",
  "image": "https://substackcdn.com/...",
  "featured": true
}
```

`content/substackPosts.js` reads this file and converts `date` strings back to `Date` objects for Eleventy. If the file is missing or unreadable, it falls back to hardcoded posts so the build never breaks.

**Image source:** The `cover_image` field in the Substack API response; `null` if a post has no cover image.

---

## Content Jasmine Can Edit (No Code Required)

All content files live in `content/`. Open any file in GitHub's browser editor, make changes, and commit — the site rebuilds automatically in about a minute.

---

### Homepage text — `content/homepage.yaml`

Controls all major text on the homepage: hero headline and bio, credential cards, newsletter intro, about section body and pullquote, therapy section, and section headings. The file has comments explaining every field.

**Section headings** (`sections` key) — controls the four headings on the homepage ("Recent from Mental Healthy", "About Jasmine", "Writing & Press", "Research"). Use `<em>word</em>` to display a word in accent color (indigo, no italic). To get both accent color *and* italic, use `<em><i>word</i></em>`. Remove the tags entirely for a plain heading with no color accent.

---

### Research page — `content/research.yaml`

Controls the research statement (eyebrow, headline, body, affiliation), the three stats cells, the six focus area cards, and section headings (`sections.focus_heading`, `sections.publications_heading`). See Homepage above for section heading formatting options.

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

Controls the page header (eyebrow, headline, subhead), the newsletter callout box (kicker, headline, body text, Substack URL, button label), and section headings (`sections.essays_heading`, `sections.press_heading`). See Homepage above for section heading formatting options.

---

### Resources — `content/resources.yaml`

Controls the PhD guide callout (update the `url` field when the guide moves), both resource lists, and section headings (`sections.phd_heading`, `sections.ma_resources_heading`). See Homepage above for section heading formatting options. To add a resource:

```yaml
early_psychosis:          # or general_mental_health
  - name: "Program Name"
    detail: "Location or descriptor"
    url: "https://..."
```

---

### Therapy page — `content/therapy.yaml`

Controls all text on the `/therapy/` page: the page header, the specialties list, and the sidebar CTA card. To update her CPG profile URL or add/remove a specialty:

```yaml
specialties:
  items:
    - "New specialty here"
    - "Another condition"
```

The `cpg_url` appears in both `page` and `cta_card` sections — update both if the URL changes.

---

### CV — `content/Mote-CV.pdf`

To update the CV, replace `content/Mote-CV.pdf` with the new file (keeping the same filename). The site serves it at `/Mote-CV.pdf` — the "Download CV" button on the Research page links there automatically.

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
- **Daily at 6am UTC** — scheduled build as a safety net for any missed pushes
- **Via Substack cron** — the Mac Mini cron job runs daily at 8:10am, fetches new posts, and pushes `substackPostsData.json` if changed — this push triggers a new build automatically
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
| CV PDF | ✅ Added | `content/Mote-CV.pdf` — Jasmine replaces this file to update her CV |
| OG image | ❌ Missing | 1200×630px social sharing image; drop into `public/` |
| DOI URLs for publications | ❌ Mostly empty | Fill in `"url"` fields in `content/publications.json` |

---

## Key Design Decisions

Decisions made during the initial build (Claude Code, March 2026):

- **Platform:** Static site (Eleventy + GitHub Pages) over WordPress, Squarespace, or Webflow. Jasmine comfortable with file editing; GitHub in-browser editor is sufficient for her update cadence.
- **Newsletter first:** Jasmine agreed the Substack should be front and center. Homepage leads with it. *Mental Healthy* is the site's heartbeat — jasminemote.com is built around it, not the other way around.
- **Committed JSON for Substack posts** (not fetched at build time) — Substack blocks requests from GitHub Actions runners (Azure IPs), making live API calls impossible during CI builds. Instead, `content/substackPostsData.json` is committed to the repo and updated by a Mac Mini cron job. The build reads the file; no network call needed. This gives clean page loads with no CORS concerns and no flash of empty cards, while keeping post data fresh via the cron.
- **Color palette derived from Mental Healthy logo** — indigo/violet pulled from the Substack branding so site and newsletter feel like the same brand family.
- **Work With Me replaces a standalone Contact page** — therapy clients are routed to CPG and Psychology Today; all other inquiries go through the Web3Forms contact form on the same page.
- **Content in YAML/JSON, not templates** — all page text Jasmine might want to update lives in `content/` files she can edit in GitHub's browser without touching any template code.
- **Publications bar chart is fully automatic** — adding a new pub to `publications.json` updates the chart and year groupings with no template changes needed.
- **Substack post images via API** — each post card on the homepage shows the post's cover image, pulled from the `cover_image` field in the JSON API response. No manual maintenance required; images update automatically with each build.
- **Editorial post grid layout** — newsletter section uses a `7fr 4fr` two-column grid: featured post spans both rows on the left (large image + title + subtitle), two supporting posts stack on the right (each with image + title). Cards are visually separated with individual borders and gap spacing rather than hairline-divided.
- **Substack excerpt** — the `truncated_body_text` API field (falling back to `subtitle`) is used as the excerpt on post cards.

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

**Note:** The build reads Substack posts from the committed `content/substackPostsData.json` file — no network call happens at build time, so local dev works fully offline. To refresh the posts locally, run `npm run update-substack` (requires internet access).

---

## Pending / Refinement Items

The site is structurally complete and the contact form is live. Remaining tasks are assets, DNS, and content refinement.

### High priority
- [ ] **DNS cutover** — point `jasminemote.com` to GitHub Pages IPs; confirm registrar (may be WordPress.com controlled)
- [x] **Add CV PDF** — `content/Mote-CV.pdf` committed; served at `/Mote-CV.pdf`; linked from Research page
- [ ] **Content review** — Jasmine reads all page copy and submits edits via the GitHub browser editor

### Medium priority
- [ ] **Add favicon** — create from Mental Healthy logo or an initials lockup; drop any standard favicon file into `public/`
- [ ] **Add OG/social image** — 1200×630px image for social sharing previews; drop into `public/` and add `<meta property="og:image">` tags to `_includes/layouts/base.njk`
- [ ] **Fill in DOI URLs** — add `"url"` fields to entries in `content/publications.json` so publications link out to their papers

### Low priority / nice to have
- [ ] **Professional headshot** — current photo works; a dedicated professional session would upgrade it further
- [ ] **Test contact form** — send a test submission from the live site to confirm Web3Forms delivery to jasmine.mote@gmail.com
