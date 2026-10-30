// Links and settings used across pages. Her words live in src/content, not here.
export const SITE_NAME = 'Jasmine Mote, PhD';
export const SITE_URL = 'https://jasminemote.com';
export const DEFAULT_DESCRIPTION =
	'Jasmine Mote is a licensed clinical psychologist, researcher at Boston University, and writer. She sees therapy clients in the Boston area and writes Mental Healthy, a newsletter on the science of mental health for parents.';

export const LINKS = {
	substack: 'https://jasminemote.substack.com',
	scholar: 'https://scholar.google.com/citations?user=achpZVQAAAAJ&hl=en',
	researchgate: 'https://www.researchgate.net/profile/Jasmine-Mote',
	amplab: 'https://sites.bu.edu/amplab/',
	bluesky: 'https://bsky.app/profile/jmote.bsky.social',
	cv: '/Mote-CV.pdf',
	psychologyToday: 'https://www.psychologytoday.com/us/therapists/jasmine-mote-arlington-ma/1050066',
	cpg: 'https://cambridgepsych.org/clinicians/jasmine-mote/',
};

export const NAV = [
	{ label: 'Therapy', href: '/therapy/' },
	{ label: 'Writing', href: '/writing/' },
	{ label: 'Research', href: '/research/' },
	{ label: 'Resources', href: '/resources/' },
];

// Cloudflare Turnstile site key for the contact form (public; the secret is a Worker secret).
// Empty until the widget is created; the form still has its honeypot and timing checks.
export const TURNSTILE_SITE_KEY = '';
