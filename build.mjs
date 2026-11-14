// Static site generator for talbottinvestments.com (Approachable Authority template).
// Copy: content/site.mjs. VA-editable webinar content: content/webinars.json.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { site } from './content/site.mjs';

const webinars = JSON.parse(await readFile(new URL('./content/webinars.json', import.meta.url), 'utf8'));
const live = webinars.live;
const A = site.assets;

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
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
  : `<div class="template-media"><span aria-hidden="true">▶</span><strong>${esc(label)}</strong><small>Video from the 23. Website folder goes here</small></div>`;

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

function ghl(key) {
  const { id, where } = site.ghl[key];
  if (!id) return `<div class="ghl-slot" data-ghl="${key}"><strong>GHL ${key === 'calendar' ? 'calendar' : 'form'} embed</strong><br>${esc(where)}</div>`;
  const kind = key === 'calendar' ? 'booking' : 'form';
  return `<iframe class="ghl-embed" src="https://api.leadconnectorhq.com/widget/${kind}/${esc(id)}" id="ghl-${kind}-${esc(id)}" title="${esc(where.split('>').pop().trim())}"></iframe>
    <script src="https://link.msgsndr.com/js/form_embed.js" defer></script>`;
}

const SCHEDULE = '/schedule-a-call/';
const BRIEF = '/webinars/executive-investment-brief/';
const nav = [['About', '/about/'], ['Strategy', '/strategy/'], ['Portfolio', '/portfolio/'], ['Learn', '/learn/'], ['Invest With Us', '/contact/'], ['Offerings', '/offerings/'], ['Webinars', '/webinars/']];

const brand = (white = false) => {
  const logo = white ? A.logoWhite || A.logo : A.logo;
  return logo ? `<img src="${esc(logo)}" alt="${esc(site.firm)}">` : `<span>TALBOTT<small>INVESTMENTS</small></span>`;
};

function header() {
  const portal = site.portalUrl || '/contact/';
  return `<header class="header"><a class="brand-logo" href="/" aria-label="${esc(site.firm)} home">${brand(true)}</a>
    <button class="menu" aria-expanded="false" aria-controls="site-nav" type="button">Menu</button>
    <nav id="site-nav" aria-label="Main navigation">${nav.map(([l, h]) => link(l, h, 'nav-link')).join('')}
    <a class="linkedin-link" href="${esc(site.linkedinUrl)}" aria-label="${esc(site.firm)} on LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.7h3.2V19H5.1zM6.7 3.6a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM10.6 8.7h3.1v1.4h.1a3.4 3.4 0 0 1 3.1-1.7c3.3 0 3.9 2.2 3.9 5V19h-3.2v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.3z"/></svg></a>
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
      <div class="footer-socials"><a href="${esc(site.linkedinUrl)}" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h18v18H3z"/><path fill="var(--social-bg)" d="M6 10h2.4v8H6zm1.2-4A1.4 1.4 0 1 0 7.2 8.8 1.4 1.4 0 0 0 7.2 6zm3.3 4h2.3v1a2.8 2.8 0 0 1 2.4-1.2c2.5 0 3 1.6 3 3.7V18h-2.4v-4c0-1-.2-2-1.5-2s-1.5 1-1.5 2v4h-2.3z"/></svg></a></div>
      ${link('LP Login', site.portalUrl || '/contact/', 'footer-portal')}</nav></div>
    <div class="footer-legal"><small>© 2026 ${esc(site.firm)}. All rights reserved.</small><nav aria-label="Legal">${legal.map(([l, h]) => link(l, h, 'nav-link')).join('')}</nav></div>
    <p class="disclosure"><strong>NO OFFER OF SECURITIES. DISCLOSURE OF INTERESTS.</strong> ${esc(site.firm)} and its representatives do not provide tax, legal, or accounting advice. This material has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for, tax, legal, or accounting advice. Offerings are made only to accredited investors under Rule 506(c) through the applicable offering documents. You should consult your own tax, legal, and accounting advisors before engaging in any transaction.</p>
    <p class="site-credit">Website by <a href="https://goraise.ai">GoRaise.ai</a></p></footer>`;
}

function shell(title, body, { withNewsletter = true, description = '' } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex"><title>${esc(title)}</title>${description ? `<meta name="description" content="${esc(description)}">` : ''}
  <link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head>
  <body class="approachable"><a class="skip" href="#main">Skip to content</a>${header()}${body}${withNewsletter ? newsletter : ''}${footer()}</body></html>`;
}

function subpage(label, title, intro, body, art = A.pageImage) {
  return `<main id="main" class="investor-page"><section class="subpage-hero" style="--subpage-art:url('${esc(art)}')">
    <div class="subpage-wrap"><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ''}</div>
  </section><div class="subpage-wrap page-content">${body}</div></main>`;
}

const propertyCard = ([name, loc, type, size, , status, slug, photo]) => {
  const href = slug ? `/portfolio/${slug}/` : '';
  return `<article class="property">${pic(photo, name + ' photo')}<div><p class="eyebrow">${esc(status)}</p><h3>${href ? link(name, href, 'nav-link') : esc(name)}</h3><p>${esc(type)} · ${esc(loc)}</p>${href ? link('Explore →', href, 'text-link') : ''}</div></article>`;
};
const carousel = (slides) => `<div class="carousel" data-carousel><div class="rail" tabindex="0" aria-label="Recent transactions"><div class="track">${slides}</div></div><p class="sr-only" aria-live="polite" data-slide-status></p>
  <div class="controls"><button type="button" data-shift="-1" aria-label="Previous property">←</button><button type="button" data-shift="1" aria-label="Next property">→</button></div></div>`;

const articleCard = (a) => panel(a.category, a.title, a.summary, a.url || '', '', 'Explore');

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
const liveCardArt = live.flyer ? img(live.flyer, live.title + ' flyer') : ph('Live webinar flyer');

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
    <a class="education-poster" href="${BRIEF}" aria-label="Watch the Executive Investment Brief">${pic(A.briefThumbnail, 'Executive Investment Brief thumbnail')}</a>
  </section>
  <section class="section teal closing" id="contact"><span class="section-art"${cover(A.closingImage)} aria-hidden="true"></span>
    ${heading('Ready to Explore Multifamily Investing?')}<p style="margin-inline:auto">Start with a conversation about your goals, your timeline, and whether our approach is the right fit.</p>
    <div class="actions">${link('Schedule a Call →', SCHEDULE)}</div></section>
  <section class="home-resources"><div class="subpage-wrap"><p class="eyebrow">Investor Resources</p><h2>Explore Talbott Investments</h2>
    ${grid([panel('How We Invest', 'How We Invest', 'Our markets, our criteria, and how every deal is underwritten.', '/strategy/'),
      panel(`Live Webinar · ${live.date}`, live.title, `${live.time} with ${live.host}`, '/webinars/register/', liveCardArt, 'Register'),
      panel('Investor Education', 'Investor Education', 'Articles and quick answers for passive investors.', '/learn/')])}
    <p class="eyebrow">Latest Insights</p><h2>Latest Insights</h2>${grid(site.articles.slice(0, 2).map(articleCard))}
    ${section('How to Get Started', steps([['Learn', 'Watch the Executive Investment Brief or join a live webinar to see how we invest.'], ['Connect', 'Schedule a call to talk through your goals and confirm fit.'], ['Invest', 'Verify accreditation, review the offering, and invest through the investor portal.']]))}
  </div></section></main>`;

// ---------- Subpages ----------
const pages = {};

pages['about'] = ['About', subpage('Firm and Leadership', 'About Talbott Investments', 'Meet the person behind the investment process.',
  section('Our Firm', `<div class="template-split">${media(A.aboutUsVideo, 'About Us video')}<div>${p(['Talbott Investments acquires and manages value add multifamily communities in growing markets, alongside experienced operating partners. We help busy professionals build passive income through real assets.', 'Our work centers on three things: disciplined acquisitions, institutional quality operating partners, and clear investor communication.'])}</div></div>`) +
  section('Leadership', `<div class="template-split">${pic(A.headshot, 'Stephen Predmore headshot')}<div><p class="eyebrow">Managing Partner</p><h3>Stephen Predmore</h3>${p(['Stephen founded Talbott Investments after a 30 year career in engineering, where he became a licensed Professional Engineer. A corporate downsizing showed him how exposed a single paycheck can be, and he committed to building wealth through real assets and helping others do the same. Today he builds relationships with investors and operating partners, evaluates acquisitions in target markets, and oversees the investor experience from first call to distribution.'])}</div></div>${media(A.aboutMeVideo, 'About Me video (founder)')}`) +
  section('Values', steps([['Trust Is Earned', 'We do what we say we will do and prepare before we need to.'], ['Transparency', 'Assumptions, risks, and results are easy to find, not buried.'], ['Discipline', 'We pass on far more deals than we pursue.']])))];

pages['strategy'] = ['Strategy', subpage('How We Invest', 'Investment Strategy and Approach', 'How we select markets, underwrite deals, and oversee every investment.',
  section('Investment Focus', p(['We acquire value add multifamily communities: well located Class B properties in strong neighborhoods, where better management and targeted renovations can raise income and value. Hold periods typically run 2 to 5 years.'])) +
  section('Target Markets', grid([panel('Target Market', 'High Growth Metros', 'Population growth, positive net migration, job growth, and a diverse economy not reliant on one sector.'), panel('Target Market', 'Landlord Friendly States', 'A favorable tax climate, balanced regulations, and a strong institutional buyer presence for future exits.')])) +
  section('Underwriting and Approval', steps([['Source', 'Screen every opportunity against our market and property criteria.'], ['Underwrite', 'Use conservative assumptions, test downside scenarios, and build in reserves.'], ['Approve', 'Move forward only when a deal meets every standard.']])) +
  section('Deal Structure and Risk', p(['Minimums, fees, distribution priorities, and hold periods are set in each offering’s documents. Offerings are available to accredited investors under Rule 506(c).', 'Risk controls include conservative leverage, interest rate protection, healthy reserves, and investors receiving a preferred return before the sponsor participates in profits.']) + link('Explore Investor Education →', '/learn/')) +
  section('Tax Advantages', p(['Multifamily may offer depreciation, cost segregation, and 1031 exchange benefits that can reduce taxable income from distributions and defer capital gains. Benefits depend on your situation. Consult your tax advisor.'])))];

const filterGrid = `<div class="template-filters" data-filter><label>Status <select data-category><option value="">All statuses</option><option>Active</option><option>Realized</option></select></label>
  <div class="template-grid">${site.properties.map((pr) => `<div data-filter-item data-group="${esc(pr[5])}">${panel(pr[5], pr[0], `${pr[2]} · ${pr[1]} · ${pr[3]} · ${pr[4]}`, pr[6] ? `/portfolio/${pr[6]}/` : '', pic(pr[7], pr[0] + ' photo'))}</div>`).join('')}</div><p data-filter-empty hidden>No results.</p></div>`;

pages['portfolio'] = ['Portfolio', subpage('Portfolio', 'Track Record and Portfolio', 'Explore our properties, deal details, and portfolio results.',
  section('Portfolio Snapshot', stats(site.stats, true) + p(['Past performance does not guarantee future results.'])) +
  section('Recent Transactions', filterGrid) +
  section('Case Studies', grid([panel('Operating Plan', 'Rise Sunridge', 'A 200 unit value add community in Charlotte.', '/portfolio/rise-sunridge/'), panel('Full Cycle', 'Richwood Ave.', 'An acquisition to exit example in Baltimore.', '/portfolio/richwood-ave/')])))];

const metrics = [['Units', '200'], ['Acquired', 'May 2025'], ['Hold status', 'Active'], ['Purchase price', '$31,000,000'], ['Renovation budget', 'About $4.25M'], ['Loan to value', '68.3%'], ['Interest rate', 'Capped at 4.75% for 5 years'], ['Planned hold', '2 to 5 years']];
pages['portfolio/rise-sunridge'] = ['Rise Sunridge', subpage('Property Profile', 'Rise Sunridge', 'A 200 unit value add multifamily community in Charlotte, North Carolina.',
  section('Property Overview', `<div class="template-split">${pic(site.properties[0][7], 'Rise Sunridge photo')}<div><p class="eyebrow">Multifamily · Charlotte, North Carolina</p>${p(['Built in 1988 and owned by the same family for about 25 years, the property had never had interior renovations. It was acquired at about a 20% discount to comparable sales, creating a full value add opportunity across every unit.'])}</div></div>`) +
  section('Key Metrics', `<table class="metric-table"><tbody>${metrics.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`) +
  section('Why Charlotte', bullets(['An emerging market with strong upside', 'Positive net migration and steady job growth', 'A diversified job base, with no single sector above 20% of the workforce', 'A business and landlord friendly environment'])) +
  section('Why This Property', bullets(['A legacy seller who wanted a fast close', 'About a 20% discount to comparable sales', 'A Class B asset in a Class A neighborhood', '100% of units can be upgraded', 'Washer and dryer hookups in every unit, for an immediate rent premium'])) +
  section('Progress', bullets(['Distributions began within 60 days of closing', 'Exterior renovations completed in 30 days', 'Occupancy increased to 93.1%', 'Average rents increased 3.4%']), 'As of [date]') +
  link('Back to Portfolio', '/portfolio/'))];

pages['portfolio/richwood-ave'] = ['Richwood Ave.', subpage('Case Study · Full Cycle', 'Richwood Ave.', 'An acquisition to exit example from our portfolio.',
  section('Investment Lifecycle', steps([['Acquisition', 'Purchased a single family home in Baltimore, Maryland in 2020 for $66,000.'], ['Operations', '[Stephen to provide one or two sentences on the renovation and rental plan.]'], ['Exit', 'Sold after about 3.5 years for $185,000.']])) +
  link('Back to Portfolio', '/portfolio/'))];

pages['offerings'] = ['Offerings', subpage('Investor Access', 'Current Offerings', 'Speak with our team to review current and upcoming opportunities.',
  `<p>${link('Contact Investor Relations', SCHEDULE)}</p>` +
  section('Investor Access', p(['Offering materials and accreditation verification are handled through our investor portal.']) + link('Contact Investor Relations', SCHEDULE)) +
  section('Preview the Offering Flow', p(['See how we present an opportunity, from the market to the business plan.']) + link('View Sample Offering →', '/portfolio/rise-sunridge/', 'text-link')) +
  section('Get Notified', ghl('getNotified')))];

const quick = [['Who can invest?', 'Our offerings are open to accredited investors, with accreditation verified before investing.'], ['What is the minimum investment?', 'Minimums are set in each offering’s documents.'], ['How are distributions handled?', 'Distribution timing and priorities are set in each offering’s documents, and investors receive regular reporting.'], ['Where do I find tax documents?', 'Tax documents are delivered through the investor portal.'], ['How long is my capital invested?', 'Hold periods typically run 2 to 5 years and are set in each offering’s documents.']];
pages['learn'] = ['Learn', subpage('Investor Education', 'Insights and Resources', 'Articles, quick answers, and market perspective for passive real estate investors.',
  section('Resource Library', `<div class="template-filters" data-filter><label>Search resources <input type="search" data-query placeholder="Search resources"></label>
    <label>Category <select data-category><option value="">All</option>${site.articleCategories.map((c) => `<option>${esc(c)}</option>`).join('')}</select></label>
    <div class="template-grid">${site.articles.map((a) => `<div data-filter-item data-group="${esc(a.category)}">${articleCard(a)}</div>`).join('')}</div><p data-filter-empty hidden>No matching resources.</p></div>`) +
  section('Quick Answers', grid(quick.map(([q, a]) => panel('Quick Answer', q, a)))) +
  section('', link('Watch the Executive Investment Brief →', BRIEF), 'Investor Brief'))];

const replayCard = (r) => `<article class="template-panel replay-row"><div><p class="eyebrow">${esc(r.month)}</p><h3>${link(r.title, `/webinars/replay/${r.slug}/`, 'nav-link')}</h3><p>${esc(r.subtitle)}</p>${link('Watch Replay', `/webinars/replay/${r.slug}/`)}</div>${pic(r.flyer, r.title + ' flyer')}</article>`;
pages['webinars'] = ['Webinars', subpage('Investor Briefings', 'Webinars and Events', 'Watch the Executive Investment Brief on demand, join Stephen’s next live webinar, or browse past recordings.',
  section('Choose a Briefing', grid([
    panel('On Demand', 'The Executive Investment Brief', 'Reduce concentration risk, prepare for tax exposure, and build passive income through multifamily.', BRIEF, pic(A.briefThumbnail, 'Executive Investment Brief thumbnail')),
    panel('Live Webinar', live.title, `${live.date} · ${live.time}`, '/webinars/register/', liveCardArt),
    panel('Replay Library', 'Past Recordings', 'Watch past webinars on your own schedule.', '#past-recordings', pic(webinars.replays[0]?.flyer, 'Replay library')),
  ], 'webinar-cards')) +
  `<div id="past-recordings">${section('Past Recordings', `<div class="template-grid replay-list">${webinars.replays.map(replayCard).join('')}</div>`)}</div>`)];

pages['webinars/executive-investment-brief'] = ['The Executive Investment Brief', subpage('On Demand', 'The Executive Investment Brief', 'An on demand briefing on reducing concentration risk, preparing for tax exposure, and building passive income through multifamily.',
  section('What You Will Learn', bullets(['The hidden risks of RSU concentration and the tax shock that comes at vesting', 'Why multifamily moves independently of the stock market and creates consistent passive income', 'The common issues passive investors face, and how a transparent sponsor avoids them', 'A real use case: how a value add property is performing for investors today'])) +
  section('Access the Briefing', ghl('evergreen')))];

// Evergreen watch page (on Vercel for now; GHL form redirects here)
pages['webinars/executive-investment-brief/watch'] = ['Watch the Executive Investment Brief', subpage('On Demand', 'The Executive Investment Brief', 'Thank you for registering. Watch the full briefing below.',
  section('', media(webinars.evergreen.watchVideo, 'Executive Investment Brief', webinars.evergreen.thumbnail)) +
  section('Ready to Talk?', p(['Start with a conversation about your goals, your timeline, and whether our approach is the right fit.']) + link('Schedule a Call', SCHEDULE)))];

pages['webinars/register'] = ['Live Webinar Registration', subpage('Live Webinar Registration', live.title, `${live.date} · ${live.time} · Hosted by ${live.host}`,
  (live.subtitle ? `<p class="lead" style="color:#232e4d">${esc(live.subtitle)}</p>` : '') +
  `<div class="template-split"><div>${section('What You Will Learn', bullets(live.whatYouWillLearn))}${section('About This Webinar', p([live.about]))}</div><div>${pic(live.flyer, 'Live webinar flyer')}</div></div>` +
  section('Reserve a Place', ghl('liveWebinar')), live.flyer || A.pageImage)];

pages['webinars/register/thank-you'] = ['You’re Registered', subpage('You’re Registered', 'Thank You for Registering for the Live Webinar', 'Check your email for your confirmation and the link to join.',
  `<p>${live.addToCalendarUrl ? link('Add to Your Calendar', live.addToCalendarUrl) : '<span class="ghl-slot">Add to Your Calendar button: paste this month’s calendar link in content/webinars.json</span>'}</p>` +
  section('A Message from Stephen', media(live.thankYouVideo, 'Webinar thank you video')), A.pageImage), { withNewsletter: false }];

for (const r of webinars.replays) {
  pages[`webinars/replay/${r.slug}`] = [r.title, subpage(r.label, r.title, r.subtitle,
    (r.callout ? `<p class="callout-bar">${esc(r.callout)}</p>` : '') +
    section('', media(r.video, r.title + ' replay', r.flyer)) +
    section('Key Takeaways', bullets(r.takeaways)) + link('Schedule a Call', SCHEDULE))];
}

pages['schedule-a-call'] = ['Schedule a Call', subpage('Investor Relations', 'Schedule a Call', 'Pick a time to talk through your goals, your timeline, and whether our approach is the right fit.',
  `<div class="template-split"><div>${ghl('calendar')}</div><div>${section('What to Expect', bullets(['Get acquainted', 'Clarify your investment objectives', 'Determine whether there is alignment']))}</div></div>`), { withNewsletter: false }];

pages['contact'] = ['Contact', subpage('Investor Relations', 'Get Started', 'Ask a question or schedule an introductory call.',
  `<div class="template-split">${section('Get in Touch', ghl('contact'))}<div class="office-block">${section('Office', `<address>${esc(site.location)}<br><a href="tel:+14438069386">${esc(site.phone)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></address>${link('Schedule a Call', SCHEDULE)}`)}</div></div>`)];

const legalNote = (from) => `<p class="ghl-slot">Draft. Final copy is adapted from <a href="${from}">${from}</a> with every Cramlet name, email, phone, and address changed to Talbott’s. Pending legal copy paste.</p>`;
pages['privacy-policy'] = ['Privacy Policy', subpage('Legal', 'Privacy Policy', '', legalNote('https://cramletcapital.com/privacy-policy/'))];
pages['terms-of-use'] = ['Terms of Use', subpage('Legal', 'Terms of Use', '', legalNote('https://cramletcapital.com/terms-and-conditions/'))];
pages['investment-disclaimers'] = ['Investment Disclaimers', subpage('Legal', 'Investment Disclaimers', '', legalNote('https://cramletcapital.com/general-disclosure/') +
  p(['Private investments are illiquid and may result in a loss of principal. Past performance does not guarantee future results. Offerings are available only to accredited investors under Rule 506(c) and only through the applicable offering documents. Consult your tax advisor.']))];

// ---------- Write ----------
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await writeFile('dist/index.html', shell(`${site.firm} | Passive Multifamily Investing`, home, { description: 'Passive multifamily investments built on disciplined underwriting, transparent reporting, and consistent distributions.' }));
for (const [slug, [title, html, opts = {}]] of Object.entries(pages)) {
  await mkdir('dist/' + slug, { recursive: true });
  await writeFile(`dist/${slug}/index.html`, shell(`${title} | ${site.firm}`, html, opts));
}
await writeFile('dist/404.html', shell(`Page not found | ${site.firm}`, subpage('404', 'Page Not Found', 'The page you are looking for has moved.', link('Back to Home', '/'))));
console.log(`Built ${Object.keys(pages).length + 1} pages`);
