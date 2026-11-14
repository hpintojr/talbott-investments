// Talbott Investments site settings. Copy comes from
// Talbott_Website_Build_Brief_and_Copy_FINAL_11.11.2026.docx (GoRaise.ai).
// Empty strings render a labeled placeholder until the real asset or ID arrives.

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;

export const site = {
  firm: 'Talbott Investments',
  domain: 'talbottinvestments.com',
  location: 'Baltimore, Maryland',
  phone: '(443) 806 9386',
  email: 'stephen@TalbottInvestments.com',
  linkedinUrl: 'https://www.linkedin.com/in/stephen-predmore/',
  portalUrl: '', // LP portal URL (open item, owner: Stephen)
  newsletterName: 'The Engineering Collective',

  // Assets from Drive "23. Website" folder. Leave '' for a placeholder.
  assets: {
    logo: '',
    logoWhite: '',
    headshot: '/images/stephen-predmore.webp',
    headshotCutout: '/images/stephen-predmore.webp',
    aboutUsVideo: '',
    aboutMeVideo: '',
    briefThumbnail: '',
    // Stock placeholders until Talbott property photos arrive
    heroImage: photo('photo-1545324418-cc1a3fa10c00'),
    helpImage: '/images/talbott-curves-1.webp',
    whyImage: photo('photo-1460317442991-0ec209397118'),
    closingImage: photo('photo-1494526585095-c41746248156'),
    pageImage: photo('photo-1545324418-cc1a3fa10c00'),
  },

  // GHL embeds. Paste the ID from Integrate > Standard embed code.
  // Forms: https://api.leadconnectorhq.com/widget/form/<ID>
  // Calendar: https://api.leadconnectorhq.com/widget/booking/<ID>
  ghl: {
    newsletter: { id: '', where: 'Forms > 8. Article, Newsletter, Blogs > 2. Investor Newsletter' },
    getNotified: { id: '', where: 'Forms > 9. Website Forms > 2. Get Notified About the Next Offering' },
    evergreen: { id: '', where: 'Forms > 2. Evergreen Webinar > 1. Evergreen Webinar Registration' },
    liveWebinar: { id: '', where: 'Forms > 3. Live Webinars > live webinar registration form' },
    contact: { id: '', where: 'Forms > 9. Website Forms > 1. Contact Form' },
    calendar: { id: '', where: 'Calendars > Stephen Calendar Group > Investor Introduction Call - Stephen (30 min)' },
  },

  stats: [['13', 'Properties'], ['$175M', 'Portfolio Value'], ['910', 'Units'], ['9', 'States']],

  // name, location, type, size, year, status, detail page slug, photo URL
  properties: [
    ['Rise Sunridge', 'Charlotte, NC', 'Multifamily', '200 units', '2025', 'Active', 'rise-sunridge', ''],
    ['Rise Chapel Hill', 'Chapel Hill, NC', 'Multifamily', '144 units', '2025', 'Active', '', ''],
    ['Rise Crown View', 'Greensboro, NC', 'Multifamily', '119 units', '2025', 'Active', '', ''],
    ['Northwood Apts', 'Mt Airy, NC', 'Multifamily', '54 units', '2024', 'Active', '', ''],
    ['Cherry St. Apts', 'Kernersville, NC', 'Multifamily', '12 units', '2024', 'Active', '', ''],
    ['Taku Drive Apts', 'Anchorage, AK', 'Multifamily', '30 units', '2023', 'Active', '', ''],
    ['Self Storage', 'Fort Worth, TX', 'Self storage', '221 units', '2023', 'Active', '', ''],
    ['Promenade Apts', 'Greenwood, SC', 'Multifamily', '88 units', '2023', 'Active', '', ''],
    ['Hilton Tapestry', 'Sarasota, FL', 'Hospitality', '120 keys, 35 condos', '2021', 'Active', '', ''],
    ['Staybridge Suites', 'Fishers, IN', 'Hospitality', '146 keys', '2021', 'Active', '', ''],
    ['Marriott Courtyard', 'Columbus, OH', 'Hospitality', '145 keys', '2019', 'Active', '', ''],
    ['Alhambra Ave.', 'Baltimore, MD', 'Single family', '1 home', '2020', 'Active', '', ''],
    ['Richwood Ave.', 'Baltimore, MD', 'Single family', '1 home', '2020', 'Realized', 'richwood-ave', ''],
  ],

  // The 12 existing posts from Talbott's GHL Resources blog site, newest first.
  // Fill title, category, summary and url from GHL; placeholders until then.
  articleCategories: ['Tax Strategy', 'Due Diligence', 'Deal Terms and Returns', 'Investing Fundamentals'],
  articles: Array.from({ length: 12 }, (_, i) => ({
    title: `[Resources blog article ${i + 1}]`,
    category: ['Tax Strategy', 'Due Diligence', 'Deal Terms and Returns', 'Investing Fundamentals'][i % 4],
    summary: 'Pulled from Talbott’s GHL Resources blog. Link to the existing post; do not rewrite.',
    url: '',
  })),
};
