// Receives the site's native lead forms (build.mjs leadForm). Bots that fill the hidden
// "website" honeypot are silently redirected without saving anything. Real submissions are
// upserted into GHL with a per-form tag when GHL_API_TOKEN and GHL_LOCATION_ID are set, so
// GHL workflows can trigger on "Contact Tag added". Without the token it just redirects.
const TAGS = {
  newsletter: 'newsletter-optin',
  getNotified: 'offering-notify',
  evergreen: 'evergreen-webinar-registered',
  liveWebinar: 'live-webinar-registered',
  contact: 'website-contact',
};
const GHL = 'https://services.leadconnectorhq.com';

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const raw = typeof req.body === 'string' ? req.body : await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
  });
  return Object.fromEntries(new URLSearchParams(raw));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Allow', 'POST'); return res.end('Method not allowed'); }
  const body = await readBody(req);
  const next = typeof body.next === 'string' && /^\/[a-z0-9/_-]*$/i.test(body.next) ? body.next : '/thank-you/';
  const done = () => { res.statusCode = 303; res.setHeader('Location', next); res.end(); };

  if (body.website) return done(); // honeypot hit
  const tag = TAGS[body.form];
  const email = String(body.email || '').trim();
  if (!tag || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.statusCode = 400; return res.end('Please go back and enter a valid email address.'); }

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (token && locationId) {
    const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };
    try {
      const r = await fetch(`${GHL}/contacts/upsert`, {
        method: 'POST', headers,
        body: JSON.stringify({ locationId, email, firstName: body.firstName || undefined, lastName: body.lastName || undefined, phone: body.phone || undefined, tags: [tag], source: 'Website' }),
      });
      const data = await r.json().catch(() => ({}));
      const id = data?.contact?.id;
      if (id && body.message) {
        await fetch(`${GHL}/contacts/${id}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: `Website contact form:\n${String(body.message).slice(0, 5000)}` }) });
      }
      if (!r.ok) console.error('GHL upsert failed', r.status, JSON.stringify(data).slice(0, 300));
    } catch (err) {
      console.error('GHL request error', err);
    }
  }
  return done();
}
