import { readFile } from 'node:fs/promises';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Jasmine's words live in src/content: one YAML file per page, plus three JSON lists
// (publications, writing, Substack posts). Pages CMS (.pages.yml) edits them as forms; the schemas
// below are what a save must satisfy, so a slip shows up as a failed build rather than a broken page.
// Keep .pages.yml's fields in step with these.

// One YAML file → one entry, read in a page with getEntry('<name>', '<name>').
const single = <T extends z.ZodTypeAny>(name: string, schema: T) =>
	defineCollection({ loader: glob({ base: './src/content', pattern: `${name}.yaml`, generateId: () => name }), schema });

// A JSON file holding a list → one entry per item, in file order.
const list = <T extends z.ZodTypeAny>(file: string, schema: T) =>
	defineCollection({
		loader: async () => {
			const items = JSON.parse(await readFile(new URL(`./content/${file}`, import.meta.url), 'utf8'));
			return items.map((item: object, i: number) => ({ ...item, id: String(i).padStart(3, '0') }));
		},
		schema,
	});

// Search results show about 160 characters; longer still works, it just gets cut off there.
const seo = z.object({ description: z.string().max(400) });
const link = z.object({ name: z.string(), detail: z.string(), url: z.url() });

const homepage = single('homepage', z.object({
	photo: z.object({ src: z.string(), alt: z.string() }),
	hero: z.object({ eyebrow: z.string(), headline: z.string(), bio: z.string() }),
	credentials: z.array(z.object({ icon: z.string().optional(), label: z.string(), sub: z.string(), url: z.string(), external: z.boolean().default(false) })).length(4),
	newsletter: z.object({ intro: z.string() }),
	about: z.object({
		credentials: z.array(z.object({ label: z.string(), value: z.string(), sub: z.string() })),
		pullquote: z.string(),
		body: z.array(z.string()),
		tags: z.array(z.string()),
	}),
	therapy: z.object({
		eyebrow: z.string(), headline: z.string(), body: z.string(), specialties: z.array(z.string()),
		card: z.object({ title: z.string(), body: z.string(), cta_text: z.string(), cta_url: z.url() }),
	}),
	sections: z.object({ newsletter_heading: z.string(), about_heading: z.string(), writing_heading: z.string(), research_heading: z.string() }),
	seo,
}));

const therapy = single('therapy', z.object({
	page: z.object({ eyebrow: z.string(), headline: z.string(), subhead: z.string(), affiliation: z.string(), cpg_url: z.url(), cta_label: z.string() }),
	specialties: z.object({ section_title: z.string(), items: z.array(z.string()) }),
	cta_card: z.object({ title: z.string(), body: z.string(), cpg_url: z.url(), cta_label: z.string() }),
	seo,
}));

const workWithMe = single('workWithMe', z.object({
	page: z.object({ eyebrow: z.string(), headline: z.string(), subhead: z.string() }),
	therapy: z.object({
		eyebrow: z.string(), headline: z.string(), body: z.string(), cpg_url: z.url(), cta_label: z.string(),
		pt_url: z.url(), pt_label: z.string(), instruction: z.string(), how_it_works_title: z.string(), how_it_works_steps: z.array(z.string()),
	}),
	collaboration: z.object({ eyebrow: z.string(), headline: z.string(), body: z.string() }),
	seo,
}));

const research = single('research', z.object({
	statement: z.object({ eyebrow: z.string(), headline: z.string(), body: z.string(), affiliation: z.string() }),
	stats: z.array(z.object({ number: z.string(), label: z.string() })),
	focus_areas: z.array(z.object({ id: z.number(), title: z.string(), description: z.string() })),
	sections: z.object({ focus_heading: z.string(), publications_heading: z.string() }),
	seo,
}));

const writingPage = single('writingPage', z.object({
	page: z.object({ eyebrow: z.string(), headline: z.string(), subhead: z.string() }),
	newsletter_callout: z.object({ kicker: z.string(), headline: z.string(), body: z.string(), url: z.url(), cta: z.string() }),
	sections: z.object({ essays_heading: z.string(), press_heading: z.string() }),
	seo,
}));

const resources = single('resources', z.object({
	page: z.object({ eyebrow: z.string(), headline: z.string(), subhead: z.string() }),
	phd_guide: z.object({ kicker: z.string(), headline: z.string(), body: z.string(), url: z.url(), cta: z.string() }),
	crisis_intro: z.string(),
	early_psychosis: z.array(link),
	general_mental_health: z.array(link),
	sections: z.object({ phd_heading: z.string(), ma_resources_heading: z.string() }),
	seo,
}));

const publications = list('publications.json', z.object({
	year: z.number().int(),
	authors: z.string(),
	title: z.string(),
	journal: z.string().optional(),
	url: z.url().optional(),
	// Which research focus area (research.yaml focus_areas[].id) lists it as noteworthy; empty for none.
	focus_area: z.number().int().optional(),
}));

const writing = list('writing.json', z.object({
	category: z.enum(['writing', 'press']),
	source: z.string(),
	title: z.string(),
	url: z.url().optional(),
	date: z.string().optional(),
	note: z.string().optional(),
}));

// Written by the personalOS job (jobs/jasminemote_feed.py) from Substack; not edited by hand.
const substackPosts = list('substackPostsData.json', z.object({
	title: z.string(),
	url: z.url(),
	date: z.coerce.date(),
	excerpt: z.string(),
	subtitle: z.string().nullable().optional(),
	image: z.url().nullable().optional(),
	featured: z.boolean().optional(),
}));

export const collections = { homepage, therapy, workWithMe, research, writingPage, resources, publications, writing, substackPosts };
