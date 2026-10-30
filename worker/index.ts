// The site's one piece of server code: POST /api/contact, which the Work With Me form sends to
// (src/components/ContactForm.astro). Everything else is the static site, served from dist/ by
// Cloudflare before this Worker runs (wrangler.jsonc: run_worker_first only for /api/*).
//
// A submission is checked, screened for bots, then emailed to CONTACT_TO from CONTACT_FROM with
// Reply-To set to the sender, so answering is just "reply". Nothing is stored.

interface Env {
	ASSETS: Fetcher;
	EMAIL: SendEmail;
	CONTACT_TO: string; // Worker secret: a verified Email Routing destination on jasminemote.com
	CONTACT_FROM: string;
	TURNSTILE_SECRET?: string; // Cloudflare Turnstile secret; the check is skipped until it is set
}

const LIMITS = { name: 100, email: 254, role: 100, message: 5000 };
const ROLES = new Set(['Clinician — peer support or supervision', 'Academic collaborator', 'Journalist or media', 'Substack collaborator', 'Other']);
// A person takes longer than this to fill in the form.
const MIN_FILL_MS = 3000;

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request);
		if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
		return handle(request, env);
	},
} satisfies ExportedHandler<Env>;

async function handle(request: Request, env: Env): Promise<Response> {
	let data: FormData;
	try {
		data = await request.formData();
	} catch {
		return json({ ok: false, error: 'bad_request' }, 400);
	}
	// Line breaks only belong in the message, so no other field can reach a header with one.
	const field = (name: string) => String(data.get(name) ?? '').replace(/[\r\n]+/g, ' ').trim();

	// Bots get "ok" and are dropped, so they learn nothing.
	const started = Number(field('started'));
	if (field('website') || !started || Date.now() - started < MIN_FILL_MS) return json({ ok: true });

	if (env.TURNSTILE_SECRET) {
		const passed = await verifyTurnstile(field('cf-turnstile-response'), env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'));
		if (!passed) return json({ ok: false, error: 'verification' }, 400);
	}

	const msg = {
		name: field('name'),
		email: field('email'),
		role: field('role'),
		message: String(data.get('message') ?? '').trim(),
	};
	if (!msg.name || msg.name.length > LIMITS.name) return json({ ok: false, error: 'name' }, 400);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email) || msg.email.length > LIMITS.email) return json({ ok: false, error: 'email' }, 400);
	if (!ROLES.has(msg.role)) return json({ ok: false, error: 'role' }, 400);
	if (!msg.message || msg.message.length > LIMITS.message) return json({ ok: false, error: 'message' }, 400);
	if (!env.CONTACT_TO) return json({ ok: false, error: 'not_configured' }, 503);

	const preview = !['jasminemote.com', 'www.jasminemote.com'].includes(new URL(request.url).hostname);
	const subject = `${preview ? '[Preview] ' : ''}Website message: ${msg.name} (${msg.role})`;
	const sent = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) + ' ET';
	const text = `${msg.message}\n\n—\nFrom: ${msg.name} <${msg.email}>\nI am a: ${msg.role}\nSent: ${sent} via the Work With Me form on jasminemote.com`;
	const html = `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#221B2A">
<p style="white-space:pre-wrap;margin:0 0 20px">${esc(msg.message)}</p>
<table style="border-collapse:collapse;font-size:14px;color:#5A5164">
<tr><td style="padding:2px 12px 2px 0">From</td><td>${esc(msg.name)} &lt;${esc(msg.email)}&gt;</td></tr>
<tr><td style="padding:2px 12px 2px 0">I am a</td><td>${esc(msg.role)}</td></tr>
<tr><td style="padding:2px 12px 2px 0">Sent</td><td>${esc(sent)}</td></tr>
</table><p style="font-size:13px;color:#5A5164">Reply to this email to answer ${esc(msg.name)}.</p></div>`;

	try {
		await env.EMAIL.send({
			to: env.CONTACT_TO.split(',').map((a) => a.trim()).filter(Boolean),
			from: { email: env.CONTACT_FROM, name: 'jasminemote.com' },
			replyTo: msg.email,
			subject,
			text,
			html,
		});
	} catch (error) {
		const code = (error as { code?: string }).code ?? 'unknown';
		console.error(JSON.stringify({ event: 'contact_send_failed', code, message: (error as Error).message }));
		return json(preview ? { ok: false, error: 'send', code } : { ok: false, error: 'send' }, 502);
	}
	console.log(JSON.stringify({ event: 'contact_sent', role: msg.role }));
	return json({ ok: true });
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
	if (!token) return false;
	const body = new FormData();
	body.set('secret', secret);
	body.set('response', token);
	if (ip) body.set('remoteip', ip);
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
	const out = (await res.json().catch(() => ({}))) as { success?: boolean };
	return out.success === true;
}

function esc(s: string) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
