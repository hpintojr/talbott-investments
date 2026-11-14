import { investorPages, sitePages, event } from './investor-pages.mjs';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { themes } from './content.mjs';

const escape = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const text = escape;
const link = (label, href, cls = 'button') =>
  `<a class="${cls}" href="${escape(href)}">${text(label)}</a>`;
const image = (url, alt = '') => `<img src="${escape(url)}" alt="${text(alt)}" loading="lazy" decoding="async">`;
const heading = (title, label = '') => `${label ? `<p class="eyebrow">${text(label)}</p>` : ''}<h2>${text(title)}</h2>`;
const cover = (url) => ` style="--cover:url('${escape(url)}')"`;
const sections = (items, numbered = true) => items.map(([title, description], i) => `
  <article>${numbered ? `<span class="index">0${i + 1}.</span>` : ''}<h3>${text(title)}</h3><p>${text(description)}</p></article>`).join('');
const stats = (items, count = false) => `<dl class="stats">${items.map(([value, label]) =>
  `<div><dt>${text(label)}</dt><dd${count ? ' data-count' : ''}>${text(value)}</dd></div>`).join('')}</dl>`;
const cards = (assets, badge = 'Sample property') => assets.map(([title, detail, url]) => `
  <article class="property">${image(url)}<div><p class="eyebrow">${text(badge)}</p><h3>${text(title)}</h3><p>${text(detail)}</p></div></article>`).join('');
const carousel = (slides) => `<div class="carousel" data-carousel>
  <div class="rail" tabindex="0" aria-label="Sample properties"><div class="track">${slides}</div></div><p class="sr-only" aria-live="polite" data-slide-status></p>
  <div class="controls"><button type="button" data-shift="-1" aria-label="Previous property">←</button><button type="button" data-shift="1" aria-label="Next property">→</button></div>
  </div>`;
function testimonialCarousel(reviews) {
  const cards = reviews.map(([title, author, date, quote]) => {
    const initials = author.split(' ').map((word) => word[0]).join('').slice(0, 2);
    return `<article class="testimonial">
      <h3>${text(title)}</h3>
      <div class="review-rating" aria-label="Sample rating, 5 out of 5"><span aria-hidden="true">★★★★★ <small>5.0</small></span></div>
      <blockquote>${text(quote)}</blockquote>
      <button type="button" class="review-more" data-review-more>Read More</button>
      <div class="review-byline"><span class="review-avatar" aria-hidden="true">${text(initials)}</span><div><strong>${text(author)}</strong><br>${text(date)}</div></div>
    </article>`;
  }).join('');
  const dots = reviews.map((_, index) => `<button type="button" data-review-index="${index}" aria-label="Show testimonial ${index + 1}"><span></span></button>`).join('');
  return `<div class="carousel review-carousel" data-carousel aria-label="Illustrative investor testimonials">
    <div class="rail" tabindex="0" aria-label="Sample reviews"><div class="track">${cards}</div></div>
    <p class="sr-only" aria-live="off" data-slide-status></p>
    <div class="review-pagination">${dots}<button type="button" class="review-pause" data-review-pause aria-label="Pause testimonials">Ⅱ</button></div>
    <p class="review-attribution">Illustrative demo reviews</p>
    <dialog class="review-dialog" aria-labelledby="full-review-title">
      <form method="dialog"><button type="submit" aria-label="Close review">×</button></form>
      <h3 id="full-review-title"></h3><p data-review-quote></p><p data-review-author></p>
    </dialog>
  </div>`;
}
const contact = (t) => t.contactUrl || '#contact';
const portal = (t) => t.portalUrl || '#contact';
const contactAction = (t) => t.contactUrl ? link('Contact investor relations', t.contactUrl) :
  '<p class="demo-note">Template preview. Configure your booking or contact URL here.</p>';
const portalAction = (t) => t.portalUrl ? link(t.portal, t.portalUrl, 'button outline') : '';

const accordions = (items) => items.map(([title, description]) =>
  `<details class="accordion"><summary>${text(title)}</summary><div><p>${text(description)}</p></div></details>`).join('');
const reasonCards = (items) => items.map(([title, description], index) =>
  `<details class="reason"><summary><span class="index">0${index + 1}.</span><h3>${text(title)}</h3></summary><div class="reason-body"><p>${text(description)}</p></div></details>`).join('');
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

function header(t, id, home = '') {
  const routes = { about: 'about', team: 'about', portfolio: 'track-record', offerings: 'offerings', services: 'strategy', learn: 'insights', faq: 'insights', contact: 'contact' };
  const entries = t.nav.filter(([label]) => label !== 'FAQ');
  if (!entries.some(([, anchor]) => anchor === 'services')) entries.splice(1, 0, ['Strategy', 'services']);
  if (!entries.some(([, anchor]) => anchor === 'offerings')) entries.push(['Offerings', 'offerings']);
  if (!entries.some(([, anchor]) => anchor === 'portfolio')) entries.push(['Portfolio', 'portfolio']);
  entries.push(['Webinars', 'webinars']);
  const nav = entries.map(([label, anchor]) => link(label, '/' + id + '/' + (routes[anchor] || anchor) + '/', 'nav-link')).join('');
  const portalHref = t.portalUrl || '/' + id + '/contact/';
  return `<header class="header"><a class="brand" href="${escape(home || '#main')}" aria-label="${text(t.firm)} home">${t.mark.map((line) => `<span>${text(line)}</span>`).join('')}</a>
    <button class="menu" aria-expanded="false" aria-controls="site-nav" type="button">Menu</button>
    <nav id="site-nav" aria-label="Main navigation">${nav}<a class="linkedin-link" href="${escape(t.linkedinUrl)}" aria-label="${text(t.firm)} on LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.7h3.2V19H5.1zM6.7 3.6a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM10.6 8.7h3.1v1.4h.1a3.4 3.4 0 0 1 3.1-1.7c3.3 0 3.9 2.2 3.9 5V19h-3.2v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.3z"/></svg></a>${link(t.portal, portalHref, 'button portal')}</nav></header>`;
}

const legalPages = {
  'privacy-policy': {
    title: 'Privacy Policy',
    sections: [
      ['Who operates this website', 'Identify the legal entity responsible for this site, its address, and the contact for privacy requests. Add the effective date.'],
      ['Information collected and why', 'Describe information collected through forms, investor onboarding, communications, and website usage. Explain the purpose for each type of collection.'],
      ['Sharing, storage and retention', 'Identify applicable service providers, investor portal operators, and other recipients. Document how long information is kept and how it is protected.'],
      ['Cookies and choices', 'This demo saves your cookie choices in this browser. It does not run optional analytics or advertising scripts. Use Cookie Settings in the footer to change your choices. Some images and videos are loaded from external providers. Before launch, update this section to describe the services and storage your firm actually uses.'],
    ],
  },
  'terms-of-use': {
    title: 'Terms of Use',
    sections: [
      ['Website use', 'This demo provides general information. Site materials are for personal informational use. Visitors should respect intellectual property and avoid interfering with site operation.'],
      ['Third-party services', 'External websites and investor portals may be subject to their own terms and privacy policies. Review those terms before using those services.'],
      ['Offering documents', 'Any investment opportunity is governed by its applicable offering documents and agreements. Website material is general information.'],
      ['Terms for the destination firm', 'Add the website operator’s legal name, effective date, contact information, and approved governing terms before publishing.'],
    ],
  },
  'investment-disclaimers': {
    title: 'Investment Disclaimers',
    sections: [
      ['Investment risk', 'Private investments can be illiquid and may result in a loss of principal. Review the specific risks, fees, and terms in the applicable offering documents.'],
      ['Past performance and projections', 'Past performance does not guarantee future results. Estimates and projections depend on assumptions, and actual results may differ.'],
      ['Illustrative material', 'The portfolio figures, investment examples, and reviews displayed on this demo are illustrative.'],
      ['Disclosure of interests', 'Add the legal issuer, applicable eligibility requirements, sponsor interests and compensation, and any approved disclosures specific to the offering.'],
    ],
  },
};

function disclosure(t) {
  return `<strong>NO OFFER OF SECURITIES—DISCLOSURE OF INTERESTS.</strong> ${text(t.firm)} and its representatives do not provide tax, legal, or accounting advice. This material has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for tax, legal, or accounting advice. You should consult your own tax, legal, and accounting advisors before engaging in any transaction.`;
}

const socialIcons = {
  LinkedIn: ['https://www.linkedin.com/', '<path fill="currentColor" d="M3 3h18v18H3z"/><path fill="var(--social-bg)" d="M6 10h2.4v8H6zm1.2-4A1.4 1.4 0 1 0 7.2 8.8 1.4 1.4 0 0 0 7.2 6zm3.3 4h2.3v1a2.8 2.8 0 0 1 2.4-1.2c2.5 0 3 1.6 3 3.7V18h-2.4v-4c0-1-.2-2-1.5-2s-1.5 1-1.5 2v4h-2.3z"/>'],
  Facebook: ['https://www.facebook.com/', '<path fill="currentColor" d="M3 3h18v18h-6.3v-7h2.4l.4-2.7h-2.8V9.6c0-.8.2-1.4 1.4-1.4h1.5V5.8l-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v1.8H9.3V14h2.4v7H3z"/>'],
  Instagram: ['https://www.instagram.com/', '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></g><circle fill="currentColor" cx="17.5" cy="6.8" r="1"/>'],
  X: ['https://x.com/', '<path fill="currentColor" d="M4 3h4.7l4.5 6 5-6H21l-6.6 7.8L22 21h-4.7l-5-6.7L6.5 21H3.7l7.3-8.5zm3.8 2H7l11.2 14h.8z"/>'],
};

function footerSocials(t, names, tag = 'nav') {
  return `<${tag} class="footer-socials"${tag === 'nav' ? ' aria-label="Social media"' : ''}>${names.map((name) => {
    const [destination, icon] = socialIcons[name];
    return `<a href="${escape(t.socialUrls?.[name] || (name === 'LinkedIn' && t.linkedinUrl) || destination)}" aria-label="${name}"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></a>`;
  }).join('')}</${tag}>`;
}

function footer(t, id, home = '') {
  const legalLinks = Object.entries(legalPages).map(([slug, { title }]) => link(title, '/' + id + '/' + slug + '/', 'nav-link')).join('');
  const links = (items) => items.map(([label, anchor]) => link(label, home + '#' + anchor, 'nav-link')).join('');
  const investors = link(t.portal, t.portalUrl || home + '#contact', 'nav-link');
  const address = '<address>123 Main Street<br>Beverly Hills, CA 90210</address>';
  const wordmark = `<strong class="footer-wordmark">${t.mark.map((part) => `<span>${text(part)}</span>`).join('')}</strong>`;
  const contactInfo = `<div class="footer-contact">${address}${link('Schedule an intro call', t.contactUrl || home + '#contact', 'nav-link')}${footerSocials(t, ['LinkedIn', 'Facebook', 'Instagram', 'X'])}</div>`;
  const legal = `<div class="footer-legal"><small>© ${new Date().getUTCFullYear()} ${text(t.firm)}. All rights reserved.</small><nav aria-label="Legal">${legalLinks}</nav></div>
    <p class="disclosure">${disclosure(t)}</p>`;

  if (id === 'institutional') return `<footer class="section footer institutional-footer" ${cover(t.skyline)}>
    <div class="institutional-footer-top">
      <nav aria-label="Footer">${links(t.nav)}${investors}</nav>
      <div class="institutional-footer-brand">
        <a href="${escape(home || '#main')}" aria-label="${text(t.firm)} home" class="footer-emblem">
          <svg width="84" height="94" viewBox="0 0 84 94" aria-hidden="true"><path fill="#f4772a" d="M42 3a34 34 0 1 1 0 68 34 34 0 0 1 0-68z"/><path fill="#fff" d="M42 91 9 47h12l12 12 9-32 11 20 9-9h13z"/><path fill="#0e1227" d="m42 91 11-44 9-9h13z"/></svg>
          ${wordmark}
        </a>
        ${link('All templates', '/', 'nav-link')}
      </div>${contactInfo}
    </div>${legal}</footer>`;

  if (id === 'bold') return `<footer class="section footer bold-footer"><div class="bold-footer-top">
    <div>${wordmark}<p>${text(t.description)}</p>${address}</div>
    <nav aria-label="Company"><strong>— Company</strong>${[['About','about'],['Portfolio','track-record'],['Team','about'],['Services','strategy']].map(([label, path]) => link(label, home + path + '/', 'nav-link')).join('')}</nav>
    <nav aria-label="Invest"><strong>— Invest</strong>${link(t.portal, t.portalUrl || home + 'contact/', 'nav-link')}${[['Current Offerings','offerings'],['Resources','insights'],['Webinars & Events','webinars']].map(([label, path]) => link(label, home + path + '/', 'nav-link')).join('')}</nav>
    <div><strong>— Connect</strong><nav aria-label="Connect">${link('Contact', home + 'contact/', 'nav-link')}${link('All templates', '/', 'nav-link')}</nav>${footerSocials(t, ['LinkedIn', 'Instagram', 'Facebook'])}</div>
    </div>${legal}</footer>`;

  return `<footer class="section footer approachable-footer">
    <div class="approachable-footer-top"><div>${wordmark}${address}</div><nav aria-label="Footer">${links(t.nav)}${footerSocials(t, ['LinkedIn'], 'div')}${link(t.portal, t.portalUrl || home + '#contact', 'footer-portal')}</nav></div>
    <div class="footer-directory">${link('All templates', '/', 'nav-link')}</div>
    ${legal}</footer>`;
}

function legalPage(t, id, document) {
  const home = '/' + id + '/';
  const body = `<main id="main" class="legal-main section"><article>
    <p class="eyebrow">${text(t.firm)} · Draft for review</p><h1>${text(document.title)}</h1>
    <p class="legal-draft">Demo language. Complete firm-specific details and obtain legal review before publishing.</p>
    ${document.sections.map(([title, paragraph]) => `<section><h2>${text(title)}</h2><p>${text(paragraph)}</p></section>`).join('')}
    ${link('Back to the homepage', home, 'text-link')}
    </article></main>`;
  return page(document.title + ' · ' + t.firm, id, body + footer(t, id, home), header(t, id, home));
}

function sectionArt(url) {
  return `<span class="section-art" ${cover(url)} aria-hidden="true"></span>`;
}

function approachable(t) {
  return `<section class="hero cover" ${cover(t.heroImage)}>
      ${heroLinework()}<div class="hero-copy"><h1>${t.headline.map(text).join('<br>')}</h1>
      <p>${text(t.description)}</p>${link(t.primary + ' →', contact(t))}</div>
    </section>
    <section class="section split intro" id="about"><div class="intro-copy"><p class="lead">${text(t.intro)}</p>${link(t.introLinkLabel + ' →', '#learn')}</div>
      <div class="intro-panel"><h2>${text(t.introTitle)}</h2>${image(t.peopleImage, t.peopleImageAlt)}</div>
    </section>
    <section class="section teal help-section" id="how-we-help">${sectionArt(t.helpImage)}
      <div class="help-heading">${heading(t.helpTitle, 'How We Help')}</div>
      <div class="help-copy"><p>${text(t.helpDescription)}</p>${link('Learn How ' + t.firm + ' Works →', '#why')}</div>
      <div class="rows help-cards">${sections(t.benefits)}</div>
    </section>
    <section class="section track-record" id="portfolio">
      <h2>Track Record</h2><p class="track-subtitle">Recent Closed Deals <small>Illustrative data</small></p>
      <div class="portfolio-layout" id="recent-deals">${carousel(cards(t.assets, 'Closed'))}${stats(t.stats, true)}</div>
      ${link('See Our Portfolio →', t.portfolioUrl || '#recent-deals')}
    </section>
    <section class="section teal differentiators" id="why">${sectionArt(t.differentiatorImage)}
      <div class="why-heading">${heading('What Makes Our Approach Different', 'Why ' + t.firm)}</div><p class="why-intro">${text(t.differentiatorIntro)}</p>
      <div class="tiles">${reasonCards(t.reasons)}</div>${link(t.primary + ' →', contact(t))}
    </section>
    <section class="section teal education-section" id="learn">
      <div class="education-copy">${heading('New to Private Real Estate Investing?', 'Start Here')}
        <p>Learn how private investments are structured, where returns come from, and what risks to consider before committing.</p>
        ${link('Watch the Video →', t.educationUrl)}
      </div>
      <a class="education-poster" href="${escape(t.educationUrl)}" aria-label="Watch the reference introduction to private real estate investing">
        ${image(t.educationPoster)}
      </a>
    </section>
    <section class="section testimonials" id="testimonials">${heading('What Investors Say', 'Testimonials')}
      ${testimonialCarousel(t.testimonials)}
    </section>
    <section class="section teal closing" id="contact">${sectionArt(t.closingImage)}${heading('Ready to Explore Alternative Investments?')}<div class="actions">${link('Education First →', '#learn', 'button outline')}${portalAction(t)}${contactAction(t)}</div></section>`;
}

function bold(t, newsletter) {
  const [first, second, third, fourth] = t.headline;
  const art = 'https://media.base44.com/images/public/6a087f2ab0d26e44355469b1/';
  const mark = '<span class="axis-mark" aria-hidden="true"><i></i><i></i><i></i></span>';
  const properties = [
    ['Oak Court', 'Houston, TX', '246 units', t.webinarArt.replay],
    ['Meridian Commons', 'Humble, TX', '296 units', t.featureImage],
    ['West Market Center', 'Cypress, TX', '148 units', 'https://images.squarespace-cdn.com/content/v1/61f9a1a0fb90157fbde33a70/1732717299229-3WXCWIJVFTQB0CA0DH4H/shoootin-photo-11.jpg'],
  ];
  const steps = [
    ['Create an account', '5 min', 'Set up an investor profile and review the onboarding materials.', art + '5e8a1c0ea_Screenshot2026-05-17at14648PM.png', '/bold/contact/', 'Get started'],
    ['Schedule a meeting', '15 min', 'Talk with investor relations about your goals and questions.', art + '0e7c96e3f_ChatGPTImageMay17202601_54_18PM.png', '/bold/contact/', 'Schedule a call'],
    ['View opportunities', 'As available', 'Review available opportunities and their offering materials.', t.webinarArt.replay, '/bold/offerings/', 'See offerings'],
    ['Start investing', '$50K demo minimum', 'Review the risks and complete the investment documents when ready.', art + '832bde888_filip-rankovic-grobgaard-dEqQzZ3meaU-unsplash.jpg', '/bold/offerings/', 'Review next steps'],
  ];
  return `<section class="hero"><div class="axis-wrap axis-hero">
    <div class="ticker"><span>◢◢ &nbsp; INVESTOR WEBSITE PREVIEW</span><span>${text(t.market)}</span></div>
    <div class="hero-layout"><div><h1>${text(first)}<br>in <em>${text(second.replace(/^in /, ''))}</em><br>${text(third)}<br><span>${text(fourth)}</span></h1>
    <p class="eyebrow">Investor Relations · Real Estate</p><div class="hero-tags">Acquisitions <b>◆</b> &nbsp; Operations <b>◆</b> &nbsp; Reporting <b>◆</b></div></div>
    <div class="hero-aside"><p class="eyebrow">— Multifamily Real Estate</p><p>${text(t.description)}</p>${link(t.primary + ' →', '#offerings')}${link('See our portfolio', '#portfolio', 'text-link')}</div></div>
    </div></section>
    <section class="facts" aria-label="Firm facts"><div class="axis-wrap"><dl class="axis-fact-grid">${t.facts.map(([label, value]) => `<div><dt>${text(label)}</dt><dd>${text(value)}</dd></div>`).join('')}</dl>${link('↓ Scroll', '#about', 'scroll-cue')}</div></section>
    <section class="axis-showcase" id="about">${image(t.featureImage, 'Apartment community and pool')}<div class="axis-wrap"><div class="axis-showcase-copy">${mark}<h2>Transforming<br>apartment <em>investing.</em></h2><p>${text(t.intro)}</p></div></div></section>
    <section class="axis-metrics" aria-label="Illustrative track record"><div class="axis-wrap">
    <div class="axis-metric-head"><p class="eyebrow">— Track record · Example metrics</p><span class="eyebrow">${mark} Sample data</span></div>
    <dl class="axis-metric-grid">${t.stats.map(([value,label], i) => `<div><dt><span aria-hidden="true">╱</span> ${text(label)}</dt><dd data-count>${text(value)}</dd><dd class="axis-metric-note">${['In total acquisitions', 'Acquired and managed', 'Apartment communities', 'Completed investments'][i]}</dd></div>`).join('')}</dl>
    </div></section>
    <section class="axis-section" id="portfolio"><div class="axis-wrap"><header class="axis-section-head"><div>${heading('Active assets.', '— Portfolio')}</div>${link('View all →', '/bold/track-record/', 'axis-text-link')}</header>
    <div class="tiles three">${properties.map(([name, location, units, src]) => `<article class="property"><div class="axis-card-image">${image(src, 'Illustrative apartment community')}</div><div><p class="eyebrow">╱╱ Sample property</p><h3>${text(name)}</h3><p class="axis-property-meta"><span>${text(location)}</span><span>${text(units)}</span></p></div></article>`).join('')}</div></div></section>
    <section class="axis-section axis-band" id="offerings"><div class="axis-wrap"><header class="axis-section-head">${heading('Get started with ' + t.firm, '— How to Invest')}</header>
    <div class="tiles">${steps.map(([title, time, copy, src, href, label], i) => `<article class="process-card"><div class="axis-card-image">${image(src)}</div><div><span class="index">0${i + 1}</span><h3>${text(title)}</h3><p class="eyebrow">${text(time)}</p><p>${text(copy)}</p>${link(label + ' →', href, 'axis-text-link')}</div></article>`).join('')}</div></div></section>
    <section class="axis-section axis-testimonial" aria-label="Sample investor testimonial"><div class="axis-wrap"><figure>${mark}<blockquote>“The team walked me through the investment and made time for my questions. I knew what to review and what to expect at each step.”</blockquote><figcaption class="eyebrow">— Illustrative investor testimonial</figcaption></figure></div></section>
    <section class="axis-section axis-band" id="services"><div class="axis-wrap"><header class="axis-section-head">${heading('Four teams. One mission.', '— Operating Services')}</header>
    <div class="tiles">${t.brands.map(([title, description]) => `<article class="axis-service">${mark}<h3>${text(title)}</h3><p>${text(description)}</p>${link('Learn more →', '/bold/strategy/', 'axis-text-link')}</article>`).join('')}</div></div></section>
    ${newsletter}
    <section class="axis-section closing" id="contact"><div class="axis-wrap"><header class="axis-section-head"><p class="eyebrow">— Get started</p><h2>Ready to <span>invest</span> with Axis?</h2></header><p>Explore multifamily opportunities or speak with investor relations about your next step.</p><div class="actions">${link('Explore offerings', '/bold/offerings/')}${link('Schedule a call', t.contactUrl || '/bold/contact/', 'button outline')}</div></div></section>`;
}

const portfolioMedia = (file) => 'https://cdn.prod.website-files.com/5e568633de93cd213bf81bf2/' + file;

function institutional(t) {
  const { title, summary, raised, target, terms } = t.fund;
  const funded = Math.round(Math.max(0, Math.min(1, raised / target)) * 1000) / 10;
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1, notation: 'compact' });
  return `<section class="hero cover" ${cover(t.heroImage)}>
    ${t.heroVideo ? `<video class="hero-video" muted loop playsinline preload="none" data-video="${escape(t.heroVideo)}" aria-hidden="true"></video>` : ''}
    <div class="hero-copy">
    <h1>${t.headline.map(text).join('<br>')}</h1><p class="eyebrow">${text(t.description)}</p><span class="rule"></span>${link(t.primary, '#offerings')}</div>
    <span class="vertical">PRIVATE EQUITY REAL ESTATE</span>
    <nav class="dots" aria-label="Jump to section">${[['Why','why'],['Funds','offerings'],['How','faq'],['About','about'],['Education','learn']].map(([label, id]) => `<a aria-label="${label}" href="#${id}"><span aria-hidden="true">${label}</span></a>`).join('')}</nav>
    </section>
    <section class="section institutional-pair invest-reasons" id="why"><div>
      ${heading('Why Invest with ' + t.firm + '?', 'Private Equity Real Estate')}<p class="scroll-copy">${text(t.intro)}</p>
      ${link('Explore Investments', '#offerings', 'button outline')}</div><div class="rows">${accordions(t.benefits)}</div>
    </section>
    <section class="section institutional-pair market-map" id="markets">
      <div>${heading('Why the Heartland?', 'Our Markets')}<hr><p>We focus on markets with durable housing demand, diverse employers and opportunities to improve the properties we operate.</p>
        ${link('Read More', t.marketUrl, 'button outline')}</div>${image(t.marketMap, 'Reference market map of the American Heartland')}
    </section>
    <section class="section fund" id="offerings">
      ${heading('Currently Raising Capital', 'Private Equity Real Estate Funds')}<hr>
      <article class="fund-card">
        <div><div class="fund-badge">${image(t.fundIcon)}<span>Sample</span></div><h3>${text(title)}</h3><p>Illustrative offering terms</p>
          <div class="fund-progress" style="--funded:${funded}%">
            <div class="progress" role="progressbar" aria-label="Sample fund progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${funded}"><span></span></div>
            <strong>${funded}%</strong></div>
          <div class="fund-progress-label"><span><strong>${currency.format(raised)}</strong><br>Raised</span><span><strong>${currency.format(target)}</strong><br>Target</span></div>
        </div>
        <div><p>${text(summary)}</p>${stats(terms)}${link('Learn More', '#faq')}</div>
      </article>${link('Schedule Intro Call', contact(t))}
    </section>
    <section class="section metric-band" aria-label="Illustrative track record">${stats(t.stats, true)}<small>Illustrative track record</small></section>
    <section class="section institutional-pair investor-process" id="faq" ${cover(t.processImage)}>
      <div class="rows">${sections(t.steps.slice(0, 3))}</div>
      <div>${heading('How It Works', 'The Process')}<hr><p>Explore the strategy and speak with the team about how an opportunity may fit your objectives.</p>
        <p>Review the investment documents before making a decision.</p>${link('Read More', '#contact')}</div>
    </section>
    <section class="section institutional-pair institutional-about" id="about">
      <div>${heading('Responsible Capital Management', 'About ' + t.firm)}<hr><p>${text(t.intro)}</p>${link('Meet Our Team', '#contact', 'button outline')}</div>
      ${image(t.peopleImage, 'Reference group photo from Birgo Capital')}
    </section>
    <section class="section institutional-holdings" id="portfolio" data-holdings ${cover(portfolioMedia(t.holdings[0][2]))}>
      <div class="holdings-heading">${heading('Sample Fund Holdings', 'Portfolio')}<hr>
        <div class="controls"><button type="button" data-holding-step="-1" aria-label="Previous holding">‹</button>
          <button type="button" data-holding-step="1" aria-label="Next holding">›</button></div>
      </div>
      <div class="holdings-rail" tabindex="0" aria-label="Reference property photos">${t.holdings.map(([title, city, file]) => `
        <article class="holding-card">${image(portfolioMedia(file))}<div><h3>${text(title)}</h3><p>${text(city)}</p></div></article>`).join('')}</div>
    </section>
    <section class="section institutional-insights" id="learn"><div class="insights-heading">${heading('Stay Informed', 'Insights')}<hr>${link('All Insights', t.insightsUrl, 'button outline')}</div>
      <div class="insights-feed">${t.articles.map(([title, summary, file, slug]) => `<article>${image(portfolioMedia(file))}
        <div><p class="eyebrow">Reference article</p><h3>${link(title, 'https://www.birgo.com/blog/' + slug, 'nav-link')}</h3><p>${text(summary)}</p></div></article>`).join('')}</div>
    </section>
    <a class="back-to-top" href="#main" aria-label="Back to top">↑</a>
    <section class="section institutional-booking" id="contact" ${cover(t.skyline)}>
      <div class="booking-card" data-booking>
        <div class="booking-calendar"><span class="eyebrow">${text(t.firm)}</span><h2>Meet with ${text(t.firm)}</h2>
          <div class="booking-month"><button type="button" data-month-step="-1" aria-label="Previous month">‹</button><strong data-booking-month></strong><button type="button" data-month-step="1" aria-label="Next month">›</button></div>
          <div class="booking-days" aria-label="Choose a sample date"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
          <div class="booking-days" data-booking-days></div>
        </div>
        <div class="booking-times"><p><strong>Meeting location</strong><br>Video call</p><p><strong>Meeting duration</strong><span class="booking-duration">30 minutes</span></p>
          <p><strong>What time works best?</strong><br><span data-booking-date></span></p><p class="booking-zone">Pacific Time · Demo availability</p>
          <div class="booking-slots" data-booking-slots></div><p class="booking-result" data-booking-result aria-live="polite">Demo only. Selecting a time does not book a meeting.</p>
          ${t.contactUrl ? link('Open the booking calendar', t.contactUrl) : ''}
        </div>
      </div>
    </section>`;
}

function cookiePanel(theme) {
  const categories = [
    ['necessary', 'Strictly necessary', 'Supports essential site features and remembers your cookie choices.'],
    ['performance', 'Performance', 'Allows optional audience measurement when a firm adds analytics.'],
    ['targeting', 'Targeting', 'Allows optional advertising or remarketing when configured.'],
    ['functionality', 'Functionality', 'Allows optional services to remember additional preferences.'],
  ];
  return `<button class="cookie-launcher" type="button" aria-label="Cookie Settings" aria-controls="cookie-panel" aria-expanded="false" data-cookie-open hidden>
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2"/>
      <path fill="currentColor" d="M28 8C24 11 26 16 30 17C27 22 32 26 37 23C38 26 40 26 41 25A17 17 0 1 1 28 8Z"/>
      <g fill="var(--cookie-icon-ink)"><circle cx="17" cy="18" r="2.4"/><circle cx="27" cy="17" r="1.7"/><circle cx="13" cy="27" r="1.5"/><circle cx="22" cy="29" r="2.7"/><circle cx="32" cy="30" r="2.1"/><circle cx="27" cy="36" r="1.6"/></g>
    </svg><span aria-hidden="true">Cookie Settings</span>
    <svg class="cookie-crumbs" viewBox="0 0 44 9" fill="currentColor" aria-hidden="true">
      <path d="M4 6l2-3 3 1 1 3-4 1zM15 6l3-4 4 1 1 4-5 1zM28 5l3-2 3 3-2 2-4-1zM38 7l2-3 3 2-1 2z"/>
      <circle cx="1.5" cy="7" r="1"/><circle cx="12" cy="7" r="1.3"/><circle cx="25" cy="7" r="1"/><circle cx="36" cy="7" r="1"/>
    </svg>
  </button><aside class="cookie-panel" id="cookie-panel" data-cookie-panel aria-labelledby="cookie-title" hidden>
    <button class="cookie-close" type="button" data-cookie-choice="decline" aria-label="Close and use necessary cookies only">×</button>
    <h2 id="cookie-title" tabindex="-1">${{approachable: 'Your privacy choices', bold: 'Cookie controls', institutional: 'Cookie preferences'}[theme]}</h2>
    <p>Choose what to allow. This demo remembers your preferences in this browser. <a href="/${theme}/privacy-policy/">Privacy Policy</a></p>
    <form data-cookie-form>
      <fieldset>
        <legend class="sr-only">Cookie categories</legend>
        ${categories.map(([id, label, detail]) => `<div class="cookie-category">
          <label><input type="checkbox" name="${id}"${id === 'necessary' ? ' checked disabled' : ''}> <span>${label}</span></label>
          <p class="cookie-category-detail">${detail}</p>
        </div>`).join('')}
      </fieldset>
      <div class="cookie-actions">
        <button type="button" data-cookie-choice="accept">Accept all</button>
        <button type="button" data-cookie-choice="decline">Decline all</button>
      </div>
      <button class="cookie-save" type="submit">Save preferences</button>
    </form>
    <button class="cookie-details" type="button" data-cookie-details aria-expanded="false">Customize</button>
  </aside>`;
}

function page(title, theme, body, headerHtml = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex">${theme === 'institutional' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400&amp;family=Red+Hat+Display:wght@400;500;600;700&display=swap">' : theme === 'bold' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&amp;family=Inter+Tight:wght@400;500;600;700&amp;family=JetBrains+Mono&amp;display=swap">' : ''}<title>${text(title)}</title><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head>
    <body class="${theme}"><a class="skip" href="#main">Skip to content</a>${headerHtml}${body}${headerHtml ? cookiePanel(theme) : ''}</body></html>`;
}
const layouts = { approachable, bold, institutional };
const chosen = process.env.TEMPLATE_THEME;
if (chosen && !Object.hasOwn(themes, chosen)) throw new Error('Unknown TEMPLATE_THEME: ' + chosen);

await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
const gallery = `<main id="main" class="section"><p class="eyebrow">Investor relations · Website templates</p><h1>Choose a design</h1><p>Three editable homepage layouts for private investment firms.</p><div class="tiles three">
  ${Object.entries(themes).map(([id, t]) => `<a class="gallery-card ${id}" href="/${id}/"><p class="eyebrow">Complete site template</p><h2>${text(t.label)}</h2><span>View template →</span></a>`).join('')}</div></main>`;
await writeFile('dist/index.html', page('Investor Website Templates', 'gallery', gallery));

for (const [id, t] of Object.entries(themes)) {
  const { pages, newsletter, homeExtras } = investorPages(t, id, { text, link, image, stats });
  const home = '/' + id + '/';
  const directoryLinks = Object.entries(sitePages).map(([slug, label]) => link(label, home + slug + '/', 'nav-link')).join('');
  const directoryNav = `<nav class="site-directory" aria-label="Site pages"><div class="subpage-wrap">${directoryLinks}</div></nav>`;
  const ending = newsletter + directoryNav + footer(t, id, home);
  const html = page(t.firm + ' · ' + t.label, id, id === 'bold'
    ? `<main id="main" class="bold-home">${bold(t, newsletter)}</main>${footer(t, id, home)}`
    : `<main id="main">${layouts[id](t)}${homeExtras}</main>${ending}`, header(t, id));
  await mkdir('dist/' + id, { recursive: true });
  await writeFile('dist/' + id + '/index.html', html);
  if (chosen === id) await writeFile('dist/index.html', html);
  if (!pages['offerings/sample-fund']) await rm('dist/' + id + '/offerings/sample-fund/index.html', { force: true });
  for (const [slug, subpage] of Object.entries(pages)) {
    const directory = 'dist/' + id + '/' + slug;
    await mkdir(directory, { recursive: true });
    await writeFile(directory + '/index.html', page(subpage.title + ' · ' + t.firm, id, subpage.html + ending, header(t, id, home)));
  }
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Investor Website Templates//EN', 'BEGIN:VEVENT',
    'UID:sample-webinar-20261210-' + id + '@example.com', 'DTSTAMP:20261108T000000Z',
    'DTSTART:20261210T180000Z', 'DTEND:20261210T184500Z', 'SUMMARY:Demo - ' + event.title,
    'DESCRIPTION:Sample event only.', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  await writeFile('dist/' + id + '/webinars/sample-event.ics', calendar);
  for (const [slug, document] of Object.entries(legalPages)) {
    const directory = 'dist/' + id + '/' + slug;
    await mkdir(directory, { recursive: true });
    await writeFile(directory + '/index.html', legalPage(t, id, document));
  }
}




