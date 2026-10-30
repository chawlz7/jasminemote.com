# jasminemote.com

The professional site of Jasmine Mote, PhD: clinical psychologist, researcher and writer.

- **Stack:** Astro (static) on Cloudflare Workers, plus one Worker for the contact form.
- **Editing:** Pages CMS at https://app.pagescms.org (open `chawlz7/jasminemote.com`). Every save
  publishes in about a minute.
- **Newsletter posts:** pulled from Substack hourly by a job on Charles's Mac Studio.
- **Design system:** https://claude.ai/artifact/WUgFwece82zXuPCycXUaLv

```sh
npm install
npm run dev        # local site at http://localhost:4321
npm run build      # production build into dist/ (fails on a content mistake)
npm run serve      # built site + contact Worker through Wrangler
```

See AGENTS.md for how the repo is organized and the rules for changing it.
