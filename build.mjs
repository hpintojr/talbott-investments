// Static site generator for talbottinvestments.com (Approachable Authority template).
// Copy: content/site.mjs. VA-editable webinar content: content/webinars.json.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { site } from './content/site.mjs';

const webinars = JSON.parse(await readFile(new URL('./content/webinars.json', import.meta.url), 'utf8'));
const live = webinars.live;
// GHL custom values (content/ghl-values.json snapshot; site.js refreshes them live from /api/custom-values).
const CV = JSON.parse(await readFile(new URL('./content/ghl-values.json', import.meta.url), 'utf8')).values;
const A = site.assets;

// raw(html) passes pre-built markup through esc() untouched (used for custom-value spans in titles).
const raw = (html) => ({ __raw: html, toString: () => html });
const esc = (v) => v && v.__raw !== undefined ? v.__raw : String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const link = (label, href, cls = 'button') => `<a class="${cls}" href="${esc(href)}">${esc(label)}</a>`;
const img = (url, alt = '') => `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const ph = (label) => `<div class="placeholder-photo" role="img" aria-label="${esc(label)}">${esc(label)}</div>`;
const pic = (url, label) => (url ? img(url, label) : ph(label));
const cover = (url) => ` style="--cover:url('${esc(url)}')"`;
const p = (items) => items.map((t) => `<p>${esc(t)}</p>`).join('');
const heading = (title, label = '') => `${label ? `<p class="eyebrow">${esc(label)}</p>` : ''}<h2>${esc(title)}</h2>`;
const section = (title, body, label = '') => `<section class="page-section">${label ? `<p class="eyebrow">${esc(label)}</p>` : ''}${title ? `<h2>${esc(title)}</h2>` : ''}${body}</section>`;
const grid = (items, cls = '') => `<div class="template-grid${cls ? ' ' + cls : ''}">${items.join('')}</div>`;
const steps = (items) => `<ol class="template-steps">${items.map(([t, b]) => `<li><h3>${esc(t)}</h3><p>${esc(b)}</p></li>`).join('')}</ol>`;
const bullets = (items) => `<ul class="check-list">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const stats = (items, count = false) => `<dl class="stats">${items.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd${count ? ' data-count' : ''}>${esc(v)}</dd></div>`).join('')}</dl>`;
const panel = (label, title, summary, href = '', art = '', cta = 'Explore') => `<article class="template-panel">${art}
  <p class="eyebrow">${esc(label)}</p><h3>${href ? link(title, href, 'nav-link') : esc(title)}</h3>${summary ? `<p>${esc(summary)}</p>` : ''}${href ? link(cta + ' →', href, 'text-link') : ''}</article>`;
const media = (url, label, poster = '') => url
  ? `<video class="template-video" controls playsinline preload="metadata" src="${esc(url)}"${poster ? ` poster="${esc(poster)}"` : ''} aria-label="${esc(label)}"></video>`
  : videoPh(label);
// Custom-value bindings: render the snapshot now, site.js swaps in the live GHL value.
const cvText = (key, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-cv="${key}">${esc(CV[key])}</${tag}>`;
const cv = (key) => raw(cvText(key));
const cvImg = (key, alt) => `<img src="${esc(CV[key])}" data-cv-src="${key}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const cvLink = (label, key, cls = 'button') => `<a class="${cls}" href="${esc(CV[key])}" data-cv-href="${key}">${esc(label)}</a>`;
const cvVideo = (srcKey, posterKey, label) => `<video class="template-video" controls playsinline preload="metadata" src="${esc(CV[srcKey])}" data-cv-src="${srcKey}"${CV[posterKey] ? ` poster="${esc(CV[posterKey])}"` : ''} data-cv-poster="${posterKey}" aria-label="${esc(label)}"></video>`;
const cvBullets = (keys) => `<ul class="check-list">${keys.map((k) => `<li data-cv="${k}" data-cv-hide-empty>${esc(CV[k])}</li>`).join('')}</ul>`;
const briefingDetail = (withSpeaker = true) => raw(`${cvText('webinar_date')} | ${cvText('webinar_time')}${withSpeaker ? ` | Featured Speaker: ${cvText('webinar_guest_name')}` : ''}`);

// Replay video block: cover + coded play button; click swaps in the MP4 or Streamable embed and autoplays.
function replayVideo(r) {
  const v = (r.video || '').trim();
  const cover = r.cover || r.flyer;
  let kind = '', src = '';
  if (v) {
    const iframe = v.match(/<iframe[^>]*src=["']([^"']+)["']/i);
    const sid = v.match(/streamable\.com\/(?:e\/|o\/)?([a-z0-9]+)/i);
    if (iframe) { kind = 'embed'; src = iframe[1]; }
    else if (sid) { kind = 'embed'; src = `https://streamable.com/e/${sid[1]}`; }
    else { kind = 'mp4'; src = v; }
  }
  if (!cover && !src) return videoPh(r.title, 'Webinar Replay');
  const art = cover ? `<img src="${esc(cover)}" alt="${esc(r.title)} replay cover" decoding="async">` : '<span class="replay-video-blank"></span>';
  return src
    ? `<div class="replay-video" data-kind="${kind}" data-src="${esc(src)}"><button type="button" class="replay-video-btn" aria-label="Play ${esc(r.title)} replay">${art}<span class="replay-play" aria-hidden="true"></span></button></div>`
    : `<div class="replay-video is-pending">${art}<span class="replay-play" aria-hidden="true"></span></div>`;
}

// Video-style placeholder: branded backdrop, Stephen cutout, centered play button. Swapped out once the real video or thumbnail is set.
function videoPh(title, eyebrow = 'Video') {
  return `<div class="video-ph" role="img" aria-label="${esc(title)} (video coming soon)"><img src="/images/stephen-predmore.webp" alt="" aria-hidden="true" loading="lazy"><div class="video-ph-copy"><span>${esc(eyebrow)}</span><strong>${esc(title)}</strong></div><span class="video-ph-play" aria-hidden="true"></span></div>`;
}

// GHL form / calendar embed. Renders a labeled slot until the embed ID is pasted into content/site.mjs.
function heroLinework() {
  const paths = Array.from({ length: 26 }, (_, index) => {
    const x = 1 + index * 18.7;
    const step = index - 14;
    const delay = `style="--line-delay:${(index * .04).toFixed(2)}s"`;
    if (step < 0) return `<path pathLength="1" d="M${x} 0V653" ${delay}/>`;
    const inset = 18.7 * step;
    return `<path pathLength="1" d="M${x} 0V${294 - inset}H487" ${delay}/>
            <path pathLength="1" d="M${x} 653V${350 + inset}H487" ${delay}/>`;
  }).join('');
  return `<svg class="linework" viewBox="0 0 472 653" preserveAspectRatio="none" aria-hidden="true" focusable="false">${paths}</svg>`;
}

// Native, site-styled lead forms. They post to /api/lead (api/lead.js), which drops honeypot
// hits, upserts the contact into GHL with a tag when GHL_API_TOKEN + GHL_LOCATION_ID are set,
// then redirects to the next page in the funnel.
const F = { first: ['firstName', 'First name', 'text', 'given-name'], last: ['lastName', 'Last name', 'text', 'family-name'], email: ['email', 'Email', 'email', 'email'], phone: ['phone', 'Phone', 'tel', 'tel'] };
const forms = {
  newsletter: { tag: 'newsletter-optin', fields: ['first', 'email'], button: 'Subscribe', next: '/newsletter/thank-you/' },
  getNotified: { tag: 'offering-notify', fields: ['first', 'last', 'email', 'phone'], button: 'Get Notified', next: '/thank-you/' },
  evergreen: { tag: 'evergreen-webinar-registered', fields: ['first', 'last', 'email', 'phone'], button: 'Watch the Briefing', next: '/webinars/executive-investment-brief/watch/' },
  liveWebinar: { tag: 'live-webinar-registered', fields: ['first', 'last', 'email', 'phone'], button: 'Reserve My Seat', next: '/webinars/register/thank-you/' },
  contact: { tag: 'website-contact', fields: ['first', 'last', 'email', 'phone'], message: true, button: 'Send Message', next: '/thank-you/' },
};
function leadForm(key) {
  const c = forms[key];
  const ph = { first: 'Jane', last: 'Smith', email: 'you@company.com', phone: '(555) 123-4567' };
  const input = (k) => { const [name, label, type, ac] = F[k]; return `<label><span>${label}</span><input name="${name}" type="${type}" autocomplete="${ac}" placeholder="${ph[k]}"${k === 'phone' ? '' : ' required'}></label>`; };
  const arrow = '<svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const note = key === 'newsletter' ? '<p class="lead-note"><svg aria-hidden="true" viewBox="0 0 20 20" width="14" height="14"><path d="M6 9V7a4 4 0 0 1 8 0v2m-9 0h10v8H5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>No spam. Unsubscribe anytime.</p>'
    : '<p class="lead-note"><svg aria-hidden="true" viewBox="0 0 20 20" width="14" height="14"><path d="M6 9V7a4 4 0 0 1 8 0v2m-9 0h10v8H5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>Your information stays private and is never shared.</p>';
  return `<form class="lead-form lead-form-${key}${key === 'newsletter' ? ' lead-form-inline' : ''}" method="post" action="/api/lead">
    <input type="hidden" name="form" value="${key}"><input type="hidden" name="next" value="${c.next}">
    <div class="hp" aria-hidden="true"><label>Leave this field empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
    <div class="lead-fields">${c.fields.map(input).join('')}${c.message ? '<label class="wide">Message<textarea name="message" rows="4"></textarea></label>' : ''}</div>
    <button class="button lead-submit" type="submit">${c.button}${arrow}</button>${note}</form>`;
}

function ghl(key) {
  const { id, where } = site.ghl[key];
  // The Vercel build uses native forms; the GHL export (GHL_EXPORT=1) embeds the real GHL forms.
  if (key !== 'calendar' && !(process.env.GHL_EXPORT && id)) return leadForm(key);
  if (!id) return `<div class="ghl-slot" data-ghl="${key}"><strong>GHL ${key === 'calendar' ? 'calendar' : 'form'} embed</strong><br>${esc(where)}</div>`;
  const kind = key === 'calendar' ? 'booking' : 'form';
  const frameId = kind === 'form' ? `inline-${esc(id)}` : `${esc(id)}_booking`;
  return `<iframe class="ghl-embed ghl-embed-${kind}" src="https://api.leadconnectorhq.com/widget/${kind}/${esc(id)}" id="${frameId}" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-id="${esc(id)}" scrolling="no" title="${esc(where.split('>').pop().trim())}"></iframe>
    <script src="https://link.msgsndr.com/js/form_embed.js" defer></script>`;
}

// Always-on GHL form embed (Yohannes Nov 19: register page uses the real GHL form on every host).
const ghlEmbed = (id, title) => `<iframe class="ghl-embed ghl-embed-form" src="https://api.leadconnectorhq.com/widget/form/${esc(id)}" id="inline-${esc(id)}" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-id="${esc(id)}" scrolling="no" title="${esc(title)}"></iframe>
    <script src="https://link.msgsndr.com/js/form_embed.js" defer></script>`;
const SCHEDULE = '/schedule-a-call/';
const BRIEF = '/webinars/executive-investment-brief/';
const THANKS_VIDEO = site.thankYouVideo || live.thankYouVideo;
const hero = (k) => A.pageHeroes?.[k] || A.pageImage;
const nav = [['About', '/about/'], ['Strategy', '/strategy/'], ['Portfolio', '/portfolio/'], ['Learn', '/learn/'], ['Invest With Us', '/contact/'], ['Offerings', '/offerings/'], ['Webinars', '/webinars/']];

const brand = (white = false) => {
  if (!A.logo && !A.logoWhite) return `<span>TALBOTT<small>INVESTMENTS</small></span>`;
  // White logo on dark backgrounds; the header also carries the navy logo for pages with a white header.
  const imgs = [`<img class="logo-white" src="${esc(A.logoWhite || A.logo)}" alt="${esc(site.firm)}">`];
  if (white === 'both' && A.logo) imgs.push(`<img class="logo-dark" src="${esc(A.logo)}" alt="" aria-hidden="true">`);
  return imgs.join('');
};

function header() {
  const portal = site.portalUrl || '/contact/';
  return `<header class="header"><a class="brand-logo" href="/" aria-label="${esc(site.firm)} home">${brand('both')}</a>
    <button class="menu" aria-expanded="false" aria-controls="site-nav" type="button">Menu</button>
    <nav id="site-nav" aria-label="Main navigation">${nav.map(([l, h]) => link(l, h, 'nav-link')).join('')}
    ${site.companyLinkedinUrl ? `<a class="linkedin-link" href="${esc(site.companyLinkedinUrl)}" aria-label="${esc(site.firm)} on LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.7h3.2V19H5.1zM6.7 3.6a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM10.6 8.7h3.1v1.4h.1a3.4 3.4 0 0 1 3.1-1.7c3.3 0 3.9 2.2 3.9 5V19h-3.2v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.3z"/></svg></a>` : ''}
    ${link('LP Login', portal, 'button portal')}</nav></header>`;
}

const newsletter = `<section class="newsletter-band"><div class="subpage-wrap newsletter-layout"><div><p class="eyebrow">Newsletter</p><h2>${esc(site.newsletterName)}</h2>
  <p>Practical insights on passive real estate investing, market updates, and first access to new opportunities, delivered to your inbox.</p></div>${ghl('newsletter')}</div></section>`;

const legal = [['Privacy Policy', '/privacy-policy/'], ['Terms of Use', '/terms-of-use/'], ['Investment Disclaimers', '/investment-disclaimers/']];

function footer() {
  const links = [['About', '/about/'], ['Strategy', '/strategy/'], ['Portfolio', '/portfolio/'], ['Offerings', '/offerings/'], ['Learn', '/learn/'], ['Webinars', '/webinars/'], ['Contact', '/contact/'], ['Legal and Disclosures', '/investment-disclaimers/']];
  return `<footer class="section footer approachable-footer">
    <div class="approachable-footer-top"><div><a class="brand-logo footer-wordmark" href="/">${brand(true)}</a><address>${esc(site.location)}</address></div>
    <nav aria-label="Footer">${links.map(([l, h]) => link(l, h, 'nav-link')).join('')}
      ${site.companyLinkedinUrl ? `<div class="footer-socials"><a class="footer-linkedin" href="${esc(site.companyLinkedinUrl)}" aria-label="${esc(site.firm)} on LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.7h3.2V19H5.1zM6.7 3.6a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM10.6 8.7h3.1v1.4h.1a3.4 3.4 0 0 1 3.1-1.7c3.3 0 3.9 2.2 3.9 5V19h-3.2v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.3z"/></svg></a></div>` : ''}
      ${link('LP Login', site.portalUrl || '/contact/', 'footer-portal')}</nav></div>
    <div class="footer-legal"><small>© 2026 ${esc(site.firm)}. All rights reserved.</small><nav aria-label="Legal">${legal.map(([l, h]) => link(l, h, 'nav-link')).join('')}</nav></div>
    <p class="disclosure"><strong>NO OFFER OF SECURITIES. DISCLOSURE OF INTERESTS.</strong> ${esc(site.firm)} and its representatives do not provide tax, legal, or accounting advice. This material has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for, tax, legal, or accounting advice. Offerings are made only to accredited investors under Rule 506(b) through the applicable offering documents. You should consult your own tax, legal, and accounting advisors before engaging in any transaction.</p>
    <p class="site-credit">Website by <a href="https://goraise.ai">GoRaise.ai</a></p></footer>`;
}

const OG_IMAGE = 'https://talbott-investments.vercel.app/images/og-talbott.jpg';
function shell(title, body, { withNewsletter = true, description = '' } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex"><title>${esc(title)}</title>${description ? `<meta name="description" content="${esc(description)}">` : ''}
  <meta property="og:type" content="website"><meta property="og:site_name" content="Talbott Investments"><meta property="og:title" content="${esc(title)}">${description ? `<meta property="og:description" content="${esc(description)}">` : ''}
  <meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Talbott Investments: Invest With Confidence">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">${description ? `<meta name="twitter:description" content="${esc(description)}">` : ''}<meta name="twitter:image" content="${OG_IMAGE}">
  ${A.favicon ? `<link rel="icon" href="${esc(A.favicon)}">` : ''}<link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head>
  <body class="approachable"><a class="skip" href="#main">Skip to content</a>${header()}${body}${withNewsletter ? newsletter : ''}${footer()}</body></html>`;
}

function subpage(label, title, intro, body, art = A.pageImage, heroExtra = '') {
  return `<main id="main" class="investor-page"><section class="subpage-hero${heroExtra ? ' has-hero-extra' : ''}" style="--subpage-art:url('${esc(art)}')">
    <div class="subpage-wrap"><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ''}${heroExtra}</div>
  </section><div class="subpage-wrap page-content">${body}</div></main>`;
}

const propertyCard = ([name, loc, type, size, , status, slug, photo]) => {
  const href = slug ? `/portfolio/${slug}/` : '';
  return `<article class="property">${pic(photo, name + ' photo')}<div><p class="eyebrow">${esc(status)}</p><h3>${href ? link(name, href, 'nav-link') : esc(name)}</h3><p>${esc(type)} · ${esc(loc)}</p>${href ? link('Explore →', href, 'text-link') : ''}</div></article>`;
};
const carousel = (slides) => `<div class="carousel" data-carousel><div class="rail" tabindex="0" aria-label="Recent transactions"><div class="track">${slides}</div></div><p class="sr-only" aria-live="polite" data-slide-status></p>
  <div class="controls"><button type="button" data-shift="-1" aria-label="Previous property">←</button><button type="button" data-shift="1" aria-label="Next property">→</button></div></div>`;

const articleCard = (a) => `<article class="template-panel article-card">${a.url ? `<a class="article-cover" href="${esc(a.url)}" tabindex="-1" aria-hidden="true">${a.cover ? img(a.cover, '') : '<span class="article-cover-ph">' + esc(a.category) + '</span>'}</a>` : ''}
  <p class="article-meta"><span>${esc(a.category)}</span>${a.date ? `<time>${esc(a.date)}</time>` : ''}</p><h3>${a.url ? link(a.title, a.url, 'nav-link') : esc(a.title)}</h3>${a.summary ? `<p>${esc(a.summary)}</p>` : ''}${a.url ? link('Read Article →', a.url, 'text-link') : ''}</article>`;

// ---------- Home ----------
const reasons = [
  ['We Invest Alongside You', 'Our capital goes into the same deals and is held to the same standards.'],
  ['Transparency and Consistency', 'Rigorous reporting, consistent distributions, and full visibility for the life of the investment.'],
  ['Responsible Capital Management', 'Conservative debt and healthy reserves, with no capital calls and no foreclosures.'],
  ['Preferred Economics', 'Long standing operator relationships give our investors access to opportunities and better terms than investing directly with a sponsor.'],
];
const help = [
  ['Disciplined Underwriting', 'We start with the market, stress test every assumption, and build in reserves before we commit capital.'],
  ['Experienced Operating Partners', 'We invest alongside established operators with the scale and systems to carry out the business plan.'],
  ['Transparent Reporting, Consistent Distributions', 'You always know how your investment is performing and when to expect cash flow.'],
];

const home = `<main id="main">
  <section class="hero cover" style="--overlay:#232e4d99;--cover:url('${esc(A.heroImage)}')">
    ${heroLinework()}<div class="hero-copy"><h1>Invest With Confidence.</h1>
    <p>Passive multifamily investments built on disciplined underwriting, transparent reporting, and consistent distributions.</p>${link('Schedule a Call →', SCHEDULE)}</div>
  </section>
  <section class="section split intro" id="about"><div class="intro-copy"><p class="eyebrow">About Talbott Investments</p>
    <p class="lead">Talbott Investments helps busy professionals build passive income through private multifamily real estate, with disciplined underwriting and transparent reporting.</p>
    ${link('Watch the Executive Investment Brief →', BRIEF)}</div>
    <a class="intro-panel" href="${BRIEF}"><h2>How Real Estate Can Generate Tax Shielded Income</h2>${pic(A.headshotCutout, 'Stephen Predmore')}</a>
  </section>
  <section class="section teal help-section" id="how-we-help"><span class="section-art"${cover(A.helpImage)} aria-hidden="true"></span>
    <div class="help-heading">${heading('Passive Real Estate Investing, Without the Complexity', 'How We Help')}</div>
    <div class="help-copy"><p>Private real estate can diversify a portfolio beyond the stock market. We help busy professionals understand each opportunity, its risks, and its terms before they invest.</p>${link('See How We Invest →', '/strategy/')}</div>
    <div class="rows help-cards">${help.map(([t, d], i) => `<article><span class="index">0${i + 1}.</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div>
  </section>
  <section class="section track-record" id="portfolio"><p class="eyebrow">Portfolio</p><h2>Recent Transactions</h2>
    <div class="portfolio-layout" id="recent-deals">${carousel(site.properties.map(propertyCard).join(''))}${stats(site.stats, true)}</div>
    ${link('See Our Portfolio →', '/portfolio/')}
  </section>
  <section class="section why-section" id="why">
    <div class="why-top"><div>${heading('What Makes Our Approach Different', 'Why Talbott Investments')}</div>
      <p class="why-lede">Evaluating a private investment takes time and the right information. We make the process clear from the first conversation.</p></div>
    <div class="why-grid">${reasons.map(([t, d], i) => `<article class="why-card"><span class="why-num">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div>
    <div class="why-cta">${link('Schedule a Call →', SCHEDULE)}</div>
  </section>
  <section class="section teal education-section" id="learn">
    <div class="education-copy">${heading('Is Too Much of Your Wealth Tied to One Company?', 'Start Here')}
      <p>For many tech and engineering leaders, RSUs mean a large share of net worth rides on a single stock, with a tax bill that often arrives larger than expected. The Executive Investment Brief shows how multifamily can help diversify that risk and build passive income outside your employer.</p>
      ${link('Watch the Executive Investment Brief →', BRIEF)}</div>
    <a class="education-poster" href="${BRIEF}" aria-label="Watch the Executive Investment Brief">${cvImg('3_evergreen_webinar_social_media_cover', 'The Executive Investment Brief, watch on demand')}</a>
  </section>
  <section class="section teal closing" id="contact"><span class="section-art"${cover(A.closingImage)} aria-hidden="true"></span>
    ${heading('Ready to Explore Multifamily Investing?')}<p style="margin-inline:auto">Start with a conversation about your goals, your timeline, and whether our approach is the right fit.</p>
    <div class="actions">${link('Schedule a Call →', SCHEDULE)}</div></section>
  <section class="home-resources"><div class="subpage-wrap"><p class="eyebrow">Investor Resources</p><h2>Explore Talbott Investments</h2>
    ${grid([panel('How We Invest', 'How We Invest', 'Our markets, our criteria, and how every deal is underwritten.', '/strategy/', cvImg('how_we_invest_card_image', 'How We Invest')),
      panel(raw(`Live Investor Briefing · ${cvText('webinar_date')}`), cv('webinar_name'), raw(`${cvText('webinar_time')} · Featured Speaker: ${cvText('webinar_guest_name')}`), '/webinars/register/', cvImg('webinar_marketing_cover', 'Live Investor Briefing cover'), 'Register'),
      panel('Investor Education', 'Investor Education', 'Articles and quick answers for passive investors.', '/learn/', cvImg('investor_education_card_image', 'Investor Education'))])}
    <p class="eyebrow">Latest Insights</p><h2>Latest Insights</h2>${grid(site.articles.slice(0, 2).map(articleCard))}
    ${section('How to Get Started', steps([['Learn', 'Watch the Executive Investment Brief or join a Live Investor Briefing to see how we invest.'], ['Connect', 'Schedule a call to talk through your goals and confirm fit.'], ['Invest', 'Verify accreditation, review the offering, and invest through the investor portal.']]))}
  </div></section></main>`;

// ---------- Subpages ----------
const pages = {};

const person = (x) => `<article class="template-panel person-card">${pic(x.photo, x.name + ' photo')}<p class="eyebrow">${esc(x.role)}</p><h3>${esc(x.name)}</h3>${x.bio ? `<p>${esc(x.bio)}</p>` : ''}${x.linkedin ? link('LinkedIn →', x.linkedin, 'text-link') : '<p class="ghl-slot">LinkedIn link needed</p>'}</article>`;
const partner = (x) => `<article class="template-panel"><p class="eyebrow">${esc(x.role)}</p><h3>${x.url ? link(x.name, x.url, 'nav-link') : esc(x.name)}</h3></article>`;
pages['about'] = ['About', subpage('Firm and Leadership', 'About Talbott Investments', 'Meet the person behind the investment process.',
  section('Our Firm', `<div class="template-split">${media(A.aboutUsVideo, 'About Us video', A.aboutUsPoster)}<div>${p(['Talbott Investments acquires and manages value add multifamily communities in growing markets, alongside experienced operating partners. We help busy professionals build passive income through real assets.', 'Our work centers on three things: disciplined acquisitions, institutional quality operating partners, and clear investor communication.'])}</div></div>`) +
  section('Leadership', `<div class="template-split"><img class="about-headshot" src="${esc(A.headshot)}" alt="Stephen Predmore headshot" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:cover;object-position:50% 20%"><div><p class="eyebrow">Founder and Managing Partner</p><h3>Stephen Predmore</h3>${p(site.stephenBio)}${link('Connect with Stephen on LinkedIn', site.linkedinUrl, 'button linkedin-button')}</div></div><div class="founder-story" style="margin-top:clamp(48px,6vw,88px)"><h3 style="margin:0 0 14px">Founder's Story</h3>${media(A.aboutMeVideo, 'About Me video (founder)', A.aboutMePoster)}</div>`) +
  section('Advisors', grid(site.advisors.map(person), 'person-grid')) +
  section('Strategic Partners', p(['The legal, tax, administration, and operating partners who support every Talbott offering.']) + grid(site.partners.map(partner))) +
  section('Values', steps([['Trust Is Earned', 'We do what we say we will do and prepare before we need to.'], ['Transparency', 'Assumptions, risks, and results are easy to find, not buried.'], ['Discipline', 'We pass on far more deals than we pursue.']])), hero('about'))];

pages['strategy'] = ['Strategy', subpage('How We Invest', 'Investment Strategy and Approach', 'How we select markets, underwrite deals, and oversee every investment.',
  section('Investment Focus', p(['We acquire value add multifamily communities: well located Class B properties in strong neighborhoods, where better management and targeted renovations can raise income and value. Hold periods typically run 2 to 5 years.'])) +
  section('Target Markets', grid([panel('Target Market', 'High Growth Metros', 'Population growth, positive net migration, job growth, and a diverse economy not reliant on one sector.'), panel('Target Market', 'Business-Friendly Environments', 'A favorable tax climate, balanced regulations, and a strong institutional buyer presence for future exits.')])) +
  section('Underwriting and Approval', steps([['Source', 'Screen every opportunity against our market and property criteria.'], ['Underwrite', 'Use conservative assumptions, test downside scenarios, and build in reserves.'], ['Approve', 'Move forward only when a deal meets every standard.']])) +
  section('Deal Structure and Risk', p(['Minimums, fees, distribution priorities, and hold periods are set in each offering’s documents. Offerings are available to accredited investors under Rule 506(b).', 'Risk controls include conservative leverage, interest rate protection, healthy reserves, and investors receiving a preferred return before the sponsor participates in profits.']) + link('Explore Investor Education →', '/learn/')) +
  section('Tax Advantages', p(['Multifamily may offer depreciation, cost segregation, and 1031 exchange benefits that can reduce taxable income from distributions and defer capital gains. Benefits depend on your situation. Consult your tax advisor.'])), hero('strategy'))];

const filterGrid = `<div class="template-filters" data-filter><label>Status <select data-category><option value="Active">Active</option></select></label>
  <div class="template-grid">${site.properties.map((pr) => `<div data-filter-item data-group="${esc(pr[5])}">${panel(pr[5], pr[0], `${pr[2]} · ${pr[1]} · ${pr[3]} · ${pr[4]}`, pr[6] ? `/portfolio/${pr[6]}/` : '', pic(pr[7], pr[0] + ' photo'))}</div>`).join('')}</div><p data-filter-empty hidden>No results.</p></div>`;

pages['portfolio'] = ['Portfolio', subpage('Portfolio', 'Track Record and Portfolio', 'Explore our properties, deal details, and portfolio results.',
  section('Portfolio Snapshot', stats(site.stats, true) + p(['Past performance does not guarantee future results.'])) +
  section('Recent Transactions', filterGrid) +
  section('Case Studies', grid([panel('Operating Plan', 'Rise Sunridge', 'A 200 unit value add community in Charlotte.', '/portfolio/rise-sunridge/'), panel('Active', 'Rise Bluestone', 'A 268 unit multifamily community in Raleigh.', '/portfolio/rise-bluestone/')])), hero('portfolio'))];

const STATES = { NC: 'North Carolina', AZ: 'Arizona' };
// Rise deal pages share the Sunridge layout and copy until GoRaise sends per-deal copy (Nov 17 2026).
const risePage = (pr) => {
  const [name, loc, type, size, year, status, , photo] = pr;
  const [city, st] = loc.split(', ');
  const place = `${city}, ${STATES[st] || st}`;
  const units = size.replace(' units', '');
  const metrics = [['Units', units], ['Acquired', name === 'Rise Sunridge' ? 'May 2025' : year], ['Hold status', status], ['Purchase price', '$31,000,000'], ['Renovation budget', 'About $4.25M'], ['Loan to value', '68.3%'], ['Interest rate', 'Capped at 4.75% for 5 years'], ['Planned hold', '2 to 5 years']];
  return [name, subpage('Property Profile', name, `A ${units} unit value add multifamily community in ${place}.`,
  section('Property Overview', `<div class="template-split">${pic(photo, name + ' photo')}<div><p class="eyebrow">${esc(type)} · ${esc(place)}</p>${p(['Built in 1988 and owned by the same family for about 25 years, the property had never had interior renovations. It was acquired at about a 20% discount to comparable sales, creating a full value add opportunity across every unit.'])}</div></div>`) +
  section('Key Metrics', `<table class="metric-table"><tbody>${metrics.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`) +
  section(`Why ${city}`, bullets(['An emerging market with strong upside', 'Positive net migration and steady job growth', 'A diversified job base, with no single sector above 20% of the workforce', 'A business and landlord friendly environment'])) +
  section('Why This Property', bullets(['A legacy seller who wanted a fast close', 'About a 20% discount to comparable sales', 'A Class B asset in a Class A neighborhood', '100% of units can be upgraded', 'Washer and dryer hookups in every unit, for an immediate rent premium'])) +
  section('Progress', bullets(['Distributions began within 60 days of closing', 'Exterior renovations completed in 30 days', 'Occupancy increased to 93.1%', 'Average rents increased 3.4%']), 'As of [date]') +
  link('Back to Portfolio', '/portfolio/'))];
};
for (const pr of site.properties.filter((x) => x[6].startsWith('rise-'))) pages[`portfolio/${pr[6]}`] = risePage(pr);

pages['offerings'] = ['Offerings', subpage('Investor Access', 'Current Offerings', 'Speak with our team to review current and upcoming opportunities.',
  section('Investor Access', p(['Offering materials and accreditation verification are handled through our investor portal.']) + link('Contact Investor Relations', SCHEDULE)) +
  section('Get Notified', ghl('getNotified')), hero('offerings'))];

const quick = [['Who can invest?', 'Our offerings are open to accredited investors, with accreditation verified before investing.'], ['What is the minimum investment?', 'Minimums are set in each offering’s documents.'], ['How are distributions handled?', 'Distribution timing and priorities are set in each offering’s documents, and investors receive regular reporting.'], ['Where do I find tax documents?', 'Tax documents are delivered through the investor portal.'], ['How long is my capital invested?', 'Hold periods typically run 2 to 5 years and are set in each offering’s documents.']];
// Newsletter signup sits in the Learn hero (Yohannes, Nov 15): short heading + first name/email only
const heroSubscribe = `<div class="hero-subscribe"><h2>Never Miss an Insight</h2>${process.env.GHL_EXPORT ? ghl('newsletterHero').replace('<iframe ', '<iframe allowtransparency="true" ') : leadForm('newsletter')}</div>`;
pages['learn'] = ['Learn', subpage('Investor Education', 'Insights and Resources', 'Articles, quick answers, and market perspective for passive real estate investors.',
  section('Resource Library', `<div class="template-filters" data-filter><label>Search resources <input type="search" data-query placeholder="Search resources"></label>
    <label>Category <select data-category><option value="">All</option>${site.articleCategories.map((c) => `<option>${esc(c)}</option>`).join('')}</select></label>
    <div class="template-grid article-grid">${site.articles.map((a) => `<div data-filter-item data-group="${esc(a.category)}">${articleCard(a)}</div>`).join('')}</div><p data-filter-empty hidden>No matching resources.</p></div>`) +
  section('Quick Answers', grid(quick.map(([q, a]) => panel('Quick Answer', q, a)))) +
  section('', link('Watch the Executive Investment Brief →', BRIEF), 'Investor Brief'), hero('learn'), heroSubscribe), { withNewsletter: false }];

const replayCard = (r) => `<article class="template-panel replay-row"><div><p class="eyebrow">${esc(r.month)}</p><h3>${link(r.title, `/webinars/replay/${r.slug}/`, 'nav-link')}</h3><p>${esc(r.subtitle)}</p>${link('Watch Replay', `/webinars/replay/${r.slug}/`)}</div>${pic(r.cover || r.flyer, r.title + ' cover')}</article>`;
const briefCard = `<article class="template-panel briefing-card">${cvImg('3_evergreen_webinar_social_media_cover', 'Executive Investment Brief cover')}
  <p class="eyebrow">On Demand</p>${cvText('1_evergreen_webinar_name', 'h3')}${cvText('2_evergreen_webinar_sub_header', 'p')}${cvLink('Watch the Brief', 'linkedin_webinar_lead_magnet')}</article>`;
const liveCard = `<article class="template-panel briefing-card">${cvImg('webinar_marketing_cover', 'Live Investor Briefing cover')}
  <p class="eyebrow">Live Investor Briefing</p>${cvText('webinar_name', 'h3')}${cvText('20_webinar_name_subheader', 'p')}
  <p class="briefing-meta">${esc(briefingDetail(false))}</p><p class="briefing-meta">Featured Speaker: ${cvText('webinar_guest_name')}</p>${link('Reserve Your Seat', '/webinars/register/')}</article>`;
pages['webinars'] = ['Investor Briefings', subpage('Live and On Demand', 'Investor Briefings', 'Watch the Executive Investment Brief on demand, join Stephen’s next Live Investor Briefing, or browse past briefings.',
  section('Choose a Briefing', grid([
    briefCard,
    liveCard,
    panel('Replay Library', 'Past Recordings', 'Watch past webinars on your own schedule.', '#past-recordings', pic(webinars.replays[0]?.cover || webinars.replays[0]?.flyer, 'Replay library')),
  ], 'webinar-cards')) +
  `<div id="past-recordings">${section('Past Recordings', `<div class="template-grid replay-list">${webinars.replays.map(replayCard).join('')}</div>`)}</div>`, hero('webinars'))];

pages['webinars/executive-investment-brief'] = ['The Executive Investment Brief', subpage('On Demand', cv('1_evergreen_webinar_name'), cv('2_evergreen_webinar_sub_header'),
  section('What You Will Learn', cvBullets(['6_evergreen_webinarlearn_1', '7_evergreen_webinar_learn_2', '8_evergreen_webinar_learn3', '9_evergreen_webinarlearn4'])) +
  section('Access the Briefing', ghl('evergreen')))];

// Evergreen watch page (on Vercel for now; GHL form redirects here)
pages['webinars/executive-investment-brief/watch'] = ['Watch the Executive Investment Brief', subpage('On Demand', 'The Executive Investment Brief', 'Thank you for registering. Watch the full briefing below.',
  section('', cvVideo('2_evergreen_webinar_video_url', '3_evergreen_webinar_social_media_cover', 'Executive Investment Brief')) +
  section('Ready to Talk?', p(['Start with a conversation about your goals, your timeline, and whether our approach is the right fit.']) + link('Schedule Discovery Call', site.discoveryCallUrl)), hero('webinars')), { withNewsletter: false }];

pages['webinars/register'] = ['Live Investor Briefing Registration', subpage('Live Investor Briefing', cv('webinar_name'), cv('20_webinar_name_subheader'),
  `<div class="template-split"><div>${section('What You Will Learn', cvBullets(['9_what_you_will_learn_1', '10_what_you_will_learn_2', '11_what_you_will_learn_3', '12_what_youll_learn_4']))}<section class="page-section" data-cv-section="0_about_this_event"${CV['0_about_this_event'] ? '' : ' hidden'}><h2>About This Briefing</h2>${cvText('0_about_this_event', 'p')}</section></div><div>${cvImg('webinar_marketing_cover', 'Live Investor Briefing cover')}</div></div>` +
  section('Reserve Your Seat', ghlEmbed('4j48BWsrlUr36REdk9fo', 'Live Investor Briefing registration')), CV.webinar_marketing_cover || A.pageImage, `<p class="briefing-meta">${esc(briefingDetail())}</p>`)];

const introCta = section('Ready to Talk?', p(['Schedule a short introduction call with Stephen to talk through your goals and see whether our approach is the right fit.']) + link('Schedule an Introduction Call', site.introCallUrl), 'Next Step');
pages['webinars/register/thank-you'] = ['You’re Registered', subpage('You’re Registered', 'Thank You for Registering for the Live Investor Briefing', 'Check your email for your confirmation and the link to join.',
  `<p class="briefing-meta">${cvText('webinar_name')} | ${cvText('webinar_date')} | ${cvText('webinar_time')}</p><p>${cvLink('Add to Your Calendar', 'webinar_event_calendar_link')}</p>` +
  section('A Message from Stephen', cvVideo('7_evergreen_thank_youschedule_a_call', '10_thank_you_video_thumbnail', 'Thank you message from Stephen')) +
  introCta, hero('webinars')), { withNewsletter: false }];

pages['newsletter/thank-you'] = ['Thank You for Subscribing', subpage(site.newsletterName, 'Thank You for Subscribing to Our Newsletter', 'A confirmation email and your first article are on the way to your inbox. If you do not see them shortly, please check your promotions or spam folder.',
  section('What to Expect', p([`${site.newsletterName} arrives in your inbox [twice a month], with practical articles on passive real estate investing, market insights, and first access to new opportunities.`])) +
  section('A Message from Stephen', media(THANKS_VIDEO, 'Thank you message from Stephen')) +
  introCta, hero('learn')), { withNewsletter: false }];

pages['thank-you'] = ['Thank You', subpage('Thank You', 'Thank You. We Received Your Message.', 'A member of our team will follow up shortly.', introCta, hero('contact')), { withNewsletter: false }];

for (const r of webinars.replays) {
  pages[`webinars/replay/${r.slug}`] = [r.title, subpage(r.label, r.title, r.subtitle,
    (r.callout ? `<p class="callout-bar">${esc(r.callout)}</p>` : '') +
    section('', replayVideo(r)) +
    `<div class="replay-details">${r.about ? section('About This Briefing', p([r.about])) : ''}${section('Key Takeaways', bullets(r.takeaways))}</div>` +
    link('Schedule a Call', SCHEDULE), hero('webinars'))];
}

pages['schedule-a-call'] = ['Schedule a Call', subpage('Investor Relations', 'Schedule a Call', 'Pick a time to talk through your goals, your timeline, and whether our approach is the right fit.',
  `<div class="template-split"><div>${ghl('calendar')}</div><div>${section('What to Expect', bullets(['Get acquainted', 'Clarify your investment objectives', 'Determine whether there is alignment']))}</div></div>`), { withNewsletter: false }];

pages['contact'] = ['Contact', subpage('Investor Relations', 'Get Started', 'Ask a question or schedule an introductory call.',
  `<div class="template-split">${section('Get in Touch', ghl('contact'))}<div class="office-block">${section('Office', `<ul class="contact-list">
    <li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span>${esc(site.location)}</span></li>
    <li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><a href="tel:+14438069386">${esc(site.phone)}</a></li>
    <li><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li></ul>
    <p>Prefer to talk it through? Book a 30 minute introduction call with Stephen.</p>${link('Schedule a Call', SCHEDULE)}`)}</div></div>`, hero('contact'))];

const legalNote = (from) => `<p class="ghl-slot">Draft. Final copy is adapted from <a href="${from}">${from}</a> with every Cramlet name, email, phone, and address changed to Talbott’s. Pending legal copy paste.</p>`;
pages['privacy-policy'] = ['Privacy Policy', subpage('Legal', 'Privacy Policy', '', legalNote('https://cramletcapital.com/privacy-policy/'))];
pages['terms-of-use'] = ['Terms of Use', subpage('Legal', 'Terms of Use', '', legalNote('https://cramletcapital.com/terms-and-conditions/'))];
pages['investment-disclaimers'] = ['Investment Disclaimers', subpage('Legal', 'Investment Disclaimers', '', legalNote('https://cramletcapital.com/general-disclosure/') +
  p(['Private investments are illiquid and may result in a loss of principal. Past performance does not guarantee future results. Offerings are available only to accredited investors under Rule 506(b) and only through the applicable offering documents. Consult your tax advisor.']))];

// ---------- Write ----------
const OUT = process.env.OUT || 'dist';
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp('public', OUT, { recursive: true });
await writeFile(`${OUT}/index.html`, shell(`${site.firm} | Passive Multifamily Investing`, home, { description: 'Passive multifamily investments built on disciplined underwriting, transparent reporting, and consistent distributions.' }));
for (const [slug, [title, html, opts = {}]] of Object.entries(pages)) {
  await mkdir(`${OUT}/${slug}`, { recursive: true });
  await writeFile(`${OUT}/${slug}/index.html`, shell(`${title} | ${site.firm}`, html, opts));
}
await writeFile(`${OUT}/404.html`, shell(`Page not found | ${site.firm}`, subpage('404', 'Page Not Found', 'The page you are looking for has moved.', link('Back to Home', '/'))));
console.log(`Built ${Object.keys(pages).length + 1} pages`);
