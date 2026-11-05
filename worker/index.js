/**
 * Same-origin contact endpoint for Cloudflare Workers Static Assets.
 * Secrets are configured in Cloudflare, not committed to this repository.
 * /api/contact/config exposes only the public Turnstile site key.
 */
const allowedTypes = new Set([
  '', 'Sito web', 'Interfaccia o applicazione', 'Collaborazione', 'Altro',
]);

const json = (value, status = 200, extras = {}) => new Response(JSON.stringify(value), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extras,
  },
});

const configured = (env) => Boolean(
  env.RESEND_API_KEY && env.RESEND_FROM && env.CONTACT_TO_EMAIL
  && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET,
);

const clean = (value) => typeof value === 'string' ? value.trim() : '';

const emailIsValid = (value) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function verifyTurnstile(token, request, env) {
  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
  });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.set('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) return false;

  const result = await response.json();
  return result.success === true
    && result.action === 'portfolio_contact'
    && result.hostname === new URL(request.url).hostname;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact/config') {
      if (request.method !== 'GET') return json({ ok: false }, 405, { Allow: 'GET' });
      if (!configured(env)) return json({ enabled: false }, 503);
      return json({ enabled: true, siteKey: env.TURNSTILE_SITE_KEY });
    }

    if (url.pathname !== '/api/contact') {
      return json({ ok: false, error: 'Not found' }, 404);
    }
    if (request.method !== 'POST') return json({ ok: false }, 405, { Allow: 'POST' });
    if (!configured(env)) return json({ ok: false, error: 'unavailable' }, 503);

    // The endpoint accepts browser requests from the same origin only.
    if (request.headers.get('Origin') !== url.origin) {
      return json({ ok: false, error: 'forbidden' }, 403);
    }
    if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
      return json({ ok: false, error: 'invalid_payload' }, 415);
    }
    if (Number(request.headers.get('Content-Length') || 0) > 12000) {
      return json({ ok: false, error: 'invalid_payload' }, 413);
    }

    let input;
    try {
      const content = await request.text();
      if (content.length > 12000) return json({ ok: false, error: 'invalid_payload' }, 413);
      input = JSON.parse(content);
    } catch {
      return json({ ok: false, error: 'invalid_payload' }, 400);
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return json({ ok: false, error: 'invalid_payload' }, 400);
    }

    // Spam trap: bots frequently populate hidden fields.
    if (clean(input.companyWebsite)) return json({ ok: true }, 200);

    const name = clean(input.name);
    const email = clean(input.email);
    const message = clean(input.message);
    const projectType = clean(input.projectType);
    const token = clean(input.turnstileToken);
    if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name)
      || !emailIsValid(email) || message.length < 15 || message.length > 4000
      || !allowedTypes.has(projectType)) {
      return json({ ok: false, error: 'validation' }, 400);
    }

    try {
      const human = await verifyTurnstile(token, request, env);
      if (!human) return json({ ok: false, error: 'verification' }, 400);
    } catch {
      return json({ ok: false, error: 'verification_unavailable' }, 503);
    }

    const text = [
      'Nuovo messaggio dal portfolio Gianluca Guarino',
      '',
      'Nome: ' + name,
      'Email: ' + email,
      'Argomento: ' + (projectType || 'Non specificato'),
      '',
      'Messaggio:',
      message,
    ].join('\n');

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: 'Portfolio | Nuovo messaggio da ' + name,
          text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      // Never return provider error details or email addresses to the browser.
      if (!res.ok) return json({ ok: false, error: 'delivery' }, 502);
      return json({ ok: true });
    } catch {
      return json({ ok: false, error: 'delivery' }, 502);
    }
  },
};
