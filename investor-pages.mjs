export const sitePages = {
  about: 'About / Team',
  strategy: 'Investment Strategy',
  'track-record': 'Track Record / Portfolio',
  offerings: 'Current Offerings',
  insights: 'Insights & Resources',
  webinars: 'Webinars & Events',
  contact: 'Contact / Get Started',
  legal: 'Legal & Disclosures',
};

export const event = {
  title: 'A closer look at multifamily underwriting',
  date: 'December 10, 2026 · 10:00 a.m. Pacific',
  speaker: 'Jordan Avery, sample investment lead',
};

const articles = [
  ['fund-overview', 'How to read a real estate fund overview', 'Articles', 'Start with the strategy, investment structure and time horizon.',
    ['Identify what the fund expects to own, where it plans to invest, and how it will finance acquisitions.', 'Compare the stated timeline with your liquidity needs. Read the offering documents for fees, distribution priorities, and the risks that could change outcomes.']],
  ['operating-metrics', 'What property operating metrics tell you', 'Articles', 'A guide to occupancy and net operating income.',
    ['Occupancy shows how much of a property is leased. It does not show whether rents are being collected or whether leases are profitable.', 'Compare net operating income with vacancy, concessions and operating expenses over several periods. Ask which expenses are included.']],
  ['investor-questions', 'Questions to bring to an introductory call', 'Articles', 'Prepare for a conversation about fit, risk, and reporting.',
    ['Ask who makes investment and operating decisions, how reporting works, and what can change over the life of an investment.']],
  ['investor-eligibility', 'Where is investor eligibility confirmed?', 'Quick Answers', 'Eligibility and subscription steps are handled through the firm’s investor portal.',
    ['Ask the firm which documentation and process apply to the specific offering. A demo checkbox is not eligibility verification.']],
  ['distributions', 'How are distributions reported?', 'Quick Answers', 'Look for the distribution schedule and reporting terms in the offering documents.',
    ['Payment timing depends on the offering and available cash. Statements and notices are typically shared through the investor portal.']],
  ['fees', 'Where can I review fees?', 'Quick Answers', 'Review the fee schedule in the applicable offering documents.',
    ['Check which fees are charged to the fund or property, when they apply, and whether the sponsor or an affiliate receives them.']],
  ['tax-documents', 'Where can I find tax documents?', 'Quick Answers', 'Check the portal and the firm’s reporting communications.',
    ['Ask investor relations which forms apply to your investment and when you can expect them.']],
  ['liquidity', 'What should I know about liquidity?', 'Quick Answers', 'Review the expected hold period and any transfer restrictions.',
    ['Private investments may have limited liquidity. Ask how a sale, refinancing or extension would affect the timing of proceeds.']],
];

export function investorPages(t, id, ui) {
  const { text, link, image, stats } = ui;
  const base = '/' + id + '/';
  const url = (slug) => base + slug + '/';
  const cta = (label, slug) => link(label, url(slug));
  const integrations = t.integrations || {};
  const form = (name, fields, action, label) => integrations[name]
    ? link(label, integrations[name])
    : `<form class="investor-form" action="${url(action)}" method="get">
         ${fields.map(([label, type, options]) => `<label>${text(label)}${options
           ? `<select data-crm-field="${type}" required><option value="">Select one</option>${options.map((option) => `<option>${text(option)}</option>`).join('')}</select>`
           : `<input type="${type}" data-crm-field="${text(label.toLowerCase().replaceAll(' ', '_'))}" ${type === 'tel' ? '' : 'required'}>`}</label>`).join('')}
         <button class="button" type="submit">${text(label)}</button>
         <small>Template preview. Form entries stay in this browser and are not submitted.</small>
       </form>`;
  const nameEmail = [['Full name', 'text'], ['Email', 'email']];
  const media = (name, label) => integrations[name]
    ? `<video class="template-video" controls playsinline preload="metadata" src="${text(integrations[name])}" aria-label="${text(label)}"></video>`
    : `<div class="template-media"><span aria-hidden="true">▶</span><strong>${text(label)}</strong><small>Video placement · Add approved media</small></div>`;
  const asset = t.assets?.[0] || [t.holdings[0][0], t.holdings[0][1], 'https://cdn.prod.website-files.com/5e568633de93cd213bf81bf2/' + t.holdings[0][2]];
  const webinarArt = { brief: t.heroImage, event: t.processImage || t.featureImage || t.heroImage,
    replay: asset[2], ...t.webinarArt };
  const section = (title, body) => `<section class="page-section"><h2>${text(title)}</h2>${body}</section>`;
  const copy = (paragraphs) => paragraphs.map((p) => `<p>${text(p)}</p>`).join('');
  const panel = (label, title, summary, slug, picture = '', replayRow = false) => {
    const art = picture ? image(picture) : '';
    const details = `<p class="eyebrow">${text(label)}</p><h3>${slug ? link(title, url(slug), 'nav-link') : text(title)}</h3>
    <p>${text(summary)}</p>${slug ? link('Explore →', url(slug), 'text-link') : ''}`;
    return replayRow
      ? `<article class="template-panel replay-row"><div>${details}</div>${art}</article>`
      : `<article class="template-panel">${art}${details}</article>`;
  };
  const grid = (panels, className = '') => `<div class="template-grid${className ? ' ' + className : ''}">${panels.join('')}</div>`;
  const numbered = (items) => `<ol class="template-steps">${items.map(([label, body]) => `<li><h3>${text(label)}</h3><p>${text(body)}</p></li>`).join('')}</ol>`;

  const resource = ([slug, title, category, summary]) => panel(category, title, summary, 'insights/' + slug);
  const mode = t.offeringMode || 'demo';
  const join = form('waitlist', nameEmail, 'offerings/thank-you', 'Join the investor list');
  const portal = t.portalUrl ? link('LP Login', t.portalUrl) : cta('Contact investor relations', 'contact');
  const page = (title, kicker, description, body, art = t.heroImage) => ({ title, html: `
    <main id="main" class="investor-page"><section class="subpage-hero" style="--subpage-art:url('${text(art)}')">
      <div class="subpage-wrap"><p class="eyebrow">${text(kicker)}</p><h1>${text(title)}</h1><p>${text(description)}</p></div>
    </section><div class="subpage-wrap page-content">${body}</div></main>` });
  const newsletter = `<section class="newsletter-band"><div class="subpage-wrap newsletter-layout"><div><p class="eyebrow">Newsletter</p><h2>The Capital Allocator Brief</h2><p>Market commentary and investor education, delivered monthly.</p></div>
    ${form('newsletter', [['Email', 'email']], 'newsletter/thank-you', 'Subscribe')}</div></section>`;
  const pages = {
    about: page('About the firm', 'Firm & leadership', 'Meet the people behind the investment process.',
      section('Our firm', `<div class="template-split">${media('aboutVideo', 'About us')}${copy([t.intro, 'Our sample team is organized around investment review, operations, and investor communication.'])}</div>`) +
      section('Leadership', grid([
        panel('Sample principal', 'Jordan Avery', 'Leads investment review, market screening, and acquisition decisions.', '', t.peopleImage),
        panel('Sample principal', 'Morgan Ellis', 'Oversees asset operations, reporting, and investor communication.'),
      ]) + media('founderVideo', 'Founder introduction')) +
      section('Values & partners', numbered([['Discipline', 'Write down the case for each investment.'], ['Clarity', 'Make assumptions and risks easy to find.'], ['Follow-through', 'Report on the operating plan after closing.']]) +
      copy(['Add approved partner, press, and affiliation details here.'])), t.peopleImage),
    strategy: page('Investment Strategy & Approach', 'How we invest', 'A clear view of asset selection, underwriting, and oversight.',
      section('Investment focus', copy(['Illustrative strategy: professionally operated multifamily properties with opportunities for measured operating improvements. Each deal has its own planned hold period.'])) +
      section('Target markets', grid([panel('Sample market', 'Established employment centers', 'Review employment concentration, household growth, and competing supply.'), panel('Sample market', 'Infill communities', 'Compare access to jobs, transportation, and existing housing inventory.')])) +
      section('Underwriting and approval', numbered([['Source', 'Screen opportunities against market and asset criteria.'], ['Underwrite', 'Check operating records, financing assumptions, and downside cases.'], ['Approve', 'Document the decision and review material risks before close.']])) +
      section('Deal structure and risk', copy(['Review minimums, fees, distribution priorities, and the expected hold in the applicable documents.', 'Sample risk controls include reserves, scenario analysis, and operating reviews.']) + cta('Explore market resources', 'insights'))),
    'track-record': page('Track Record & Portfolio', 'Illustrative portfolio', 'Explore example assets, deal details, and portfolio reporting.',
      section('Portfolio snapshot', stats(t.stats, true) + copy(['Illustrative figures. Past performance does not guarantee future results.'])) +
      section('Recent transactions', `<div class="template-filters" data-filter><label>Status <select data-category><option value="">All statuses</option><option>Active</option><option>Realized</option></select></label>
        <div class="template-grid"><div data-filter-item data-group="Active">${panel('Active · Sample', asset[0], asset[1], 'track-record/sample-property', asset[2])}</div>
        <div data-filter-item data-group="Realized">${panel('Realized · Sample', 'Harbor Court', 'Sample multifamily disposition and operating review.', 'track-record/harbor-court', t.heroImage)}</div></div><p data-filter-empty hidden>No results.</p></div>`) +
      section('Case studies', grid([panel('Operating plan', asset[0], 'A sample acquisition and operating plan.', 'track-record/sample-property'), panel('Full cycle', 'Harbor Court', 'A sample acquisition-to-exit case.', 'track-record/harbor-court')]))),
    'track-record/sample-property': page(asset[0], 'Illustrative property profile', 'Sample operating plan, property details, and reporting metrics.',
      section('Property overview', `<div class="template-split">${image(asset[2])}${copy([asset[1], 'Sample plan: verify the rent roll, prioritize safety and maintenance work, and review occupancy and expense trends quarterly.'])}</div>`) +
      section('Key metrics', stats([['184', 'Sample units'], ['2024', 'Sample acquisition year'], ['Active', 'Hold status']]) + cta('Back to track record', 'track-record')), asset[2]),
    'track-record/harbor-court': page('Harbor Court', 'Illustrative case study', 'Example acquisition, operations, and exit narrative.',
      section('Investment lifecycle', numbered([['Acquisition', 'Illustrative acquisition of a 96-unit property in 2020.'], ['Operations', 'Example plan focused on maintenance, leasing, and reserve management.'], ['Exit', 'Illustrative sale in 2025. No realized return is represented.']]) + cta('Back to track record', 'track-record'))),
    offerings: page('Current Offerings', 'Investor access', 'Speak with investor relations about how to review opportunities.',
      section('Investor access', copy(['Approved offering materials and eligibility checks belong in the firm’s investor portal.']) + portal) +
      (mode === 'demo' ? section('Preview the offering flow', `<form class="investor-form" action="${url('offerings/sample-fund')}" method="get"><label class="check-label"><input type="checkbox" required> I understand this is an illustrative access screen.</label><button class="button">View sample offering</button></form>`) : '') +
      section('Get notified', join)),
    'offerings/sample-fund': page('Sample Multifamily Fund', 'Illustrative offering', 'A reusable layout for an approved offering summary.',
      section('Investment overview', copy(['Sample business plan: acquire a multifamily property, address deferred maintenance, and review operating performance quarterly.']) +
      stats([['$50,000', 'Sample minimum'], ['5 years', 'Illustrative hold'], ['52.5%', 'Illustrative funding']])) +
      section('Market and diligence', copy(['Place approved market data, financial projections, risks, and offering documents here.']) + portal)),
    'offerings/thank-you': page('Investor list preview', 'Investor relations', 'This is the demo confirmation screen. No information was sent.', section('Keep exploring', cta('Explore insights', 'insights'))),
    insights: page('Insights & Resources', 'Investor education', 'Articles, quick answers, and space for future market updates.',
      section('Resource library', `<div class="template-filters" data-filter><label>Search resources <input type="search" data-query placeholder="Search titles or topics"></label>
        <label>Category <select data-category><option value="">All categories</option><option>Articles</option><option>Quick Answers</option><option>Market Updates</option></select></label>
        <div class="template-grid">${articles.map((article) => `<div data-filter-item data-group="${text(article[2])}">${resource(article)}</div>`).join('')}</div><p data-filter-empty hidden>No matching resources. Market updates will appear here when published.</p></div>`) +
      section('Investor brief', cta('Watch the Live Investor Brief', 'webinars/live-investor-brief'))),
    webinars: page('Webinars & Events', 'Investor briefings', 'Watch the on-demand brief, join the next live session, or browse the replay library.',
      section('Choose a briefing', grid([panel('On demand', 'Live Investor Brief', 'A standing overview of the strategy, track record, and investor process.', 'webinars/live-investor-brief', webinarArt.brief), panel(event.date, event.title, 'A sample live discussion with ' + event.speaker + '.', 'webinars/register', webinarArt.event), panel('Replay library', 'Past recordings', 'Review a sample market update at your own pace.', 'webinars/replay/market-update', webinarArt.replay)], 'webinar-cards')) +
      section('Past recordings', `<div class="template-grid replay-list">${panel('Sample replay', 'Multifamily market update', 'An illustrative look at rents, new supply, and debt markets.', 'webinars/replay/market-update', webinarArt.replay, true)}</div>`)),
    'webinars/live-investor-brief': page('Live Investor Brief', 'On demand', 'An overview of our illustrative strategy and investor process.',
      section('Access the briefing', form('investorBrief', nameEmail, 'webinars/live-investor-brief/watch', 'Continue to the brief'))),
    'webinars/live-investor-brief/watch': page('Watch the investor brief', 'On demand', 'Sample viewing page for the evergreen briefing.',
      section('Briefing video', media('briefVideo', 'Live Investor Brief') + cta('Schedule an intro call', 'contact'))),
    'webinars/register': page(event.title, 'Live webinar registration', event.date + ' · ' + event.speaker,
      section('Reserve a place', form('webinar', nameEmail, 'webinars/thank-you', 'Register for the webinar'))),
    'webinars/thank-you': page('Webinar registration preview', 'Registration confirmation', 'No registration was sent. This is the sample confirmation screen.',
      section(event.title, copy([event.date]) + link('Add sample event to calendar', base + 'webinars/sample-event.ics') + ' ' + cta('Browse replays', 'webinars'))),
    'webinars/replay/market-update': page('Multifamily market update', 'Webinar replay', 'A sample discussion of rents, supply, and financing.',
      section('Watch the replay', media('replayVideo', 'Market update replay')) + section('Related reading', grid(articles.slice(0, 2).map(resource)) + cta('Speak with the team', 'contact'))),
    'newsletter/thank-you': page('Newsletter signup preview', 'Capital Allocator Brief', 'No subscription was submitted. This is the sample confirmation screen.',
      section('Read or watch next', grid([resource(articles[0]), panel('On demand', 'Live Investor Brief', 'Continue to the sample video flow.', 'webinars/live-investor-brief')]))),
    contact: page('Contact / Get Started', 'Investor relations', 'Ask a question or arrange an introductory conversation.',
      section('Get in touch', `<div class="template-split">${form('contact', [...nameEmail, ['Phone', 'tel'], ['Investment interest', 'investment_interest', ['Multifamily', 'Diversified real estate', 'Education only']], ['Investment range', 'investment_range', ['Under $50,000', '$50,000–$99,999', '$100,000+', 'Prefer not to say']], ['Accreditation status', 'accreditation_status', ['Accredited', 'Not accredited', 'Unsure', 'Prefer not to say']], ['How did you hear about us?', 'source', ['Referral', 'Webinar', 'Online', 'Other']]], 'contact/thank-you', 'Send inquiry')}
        <div><h3>Office</h3><address>123 Main Street<br>Beverly Hills, CA 90210</address><p>Demo address. Add approved contact and registration information.</p>${t.contactUrl ? link('Schedule a call', t.contactUrl) : link('See the homepage contact layout', base + '#contact')}</div></div>`)),
    'contact/thank-you': page('Contact confirmation preview', 'Investor relations', 'No message was sent. This screen shows the post-submission experience.',
      section('While you’re here', cta('Browse investor resources', 'insights'))),
    legal: page('Legal, Disclosures & Privacy', 'Site information', 'Review the template documents and offering disclosures.',
      section('Legal documents', grid([panel('Draft', 'Privacy Policy', 'Website data handling and visitor choices.', 'privacy-policy'), panel('Draft', 'Terms of Use', 'Website access and third-party services.', 'terms-of-use'), panel('Draft', 'Investment Disclaimers', 'Risk, past performance, and offering-specific disclosures.', 'investment-disclaimers')]) +
      copy(['The applicable offering documents govern any investment. Replace the template disclosures with firm-approved language before launch.']))),
  };
  if (mode !== 'demo') delete pages['offerings/sample-fund'];

  for (const article of articles) {
    const [slug, title, category, summary, paragraphs] = article;
    pages['insights/' + slug] = page(title, category, summary,
      section('Investor education', `<p class="eyebrow">${text(t.firm)} editorial team · November 2026 · Sample article</p>` + copy(paragraphs)) +
      section('Related resources', grid(articles.filter((item) => item !== article).slice(0, 2).map(resource)) + cta('Back to insights', 'insights')));
  }
  const homeExtras = `<section class="home-resources"><div class="subpage-wrap"><p class="eyebrow">Investor resources</p><h2>Explore the firm</h2>
    ${grid([panel('Strategy', 'How we invest', 'Review markets, underwriting, and risk management.', 'strategy'), panel('Offerings', 'Investor access', 'Learn how to review available opportunities.', 'offerings'), panel('Webinars', event.title, event.date, 'webinars/register')])}
    <h2>Latest insights</h2>${grid(articles.slice(0, 2).map(resource))}
    ${section('How to get started', numbered([['Explore', 'Review the strategy and available educational materials.'], ['Connect', 'Speak with investor relations about your objectives.'], ['Review and follow', 'Use the approved investor portal for documents, onboarding and updates.']]))}
  </div></section>`;
  return { pages, newsletter, homeExtras };
}



