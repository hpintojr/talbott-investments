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
  // Nav and footer LinkedIn icon = Talbott company page. Icon stays hidden until this is set.
  companyLinkedinUrl: '',
  // Stephen's personal profile (About page, next to his bio)
  linkedinUrl: 'https://www.linkedin.com/in/stephen-predmore/',
  portalUrl: 'https://talbottinvestments.fundamentalportal.com/',
  // Real CTAs from Talbott's GHL funnels
  discoveryCallUrl: 'https://connect.talbottinvestments.com/company-scheduler',
  introCallUrl: 'https://connect.talbottinvestments.com/invest-stephen',
  // Thank-you video shared by the newsletter and webinar confirmation pages (Drive "11. Thank You Video")
  thankYouVideo: '',
  newsletterName: 'The Engineering Collective',

  // Assets from Drive "23. Website" folder. Leave '' for a placeholder.
  assets: {
    logo: '', // Drive "4. Logo and Favicon"
    logoWhite: '',
    favicon: '',
    headshot: '/images/stephen-predmore.webp',
    headshotCutout: '/images/stephen-predmore.webp',
    aboutUsVideo: '',
    aboutMeVideo: '',
    briefThumbnail: '',
    // Stock placeholders until Talbott property photos arrive
    // Heroes: blue versions of the Hylee-style images Hamilton picked (public/images/hero-*.webp).
    // Home hero = the long multifamily building.
    heroImage: '/images/hero-building.webp',
    helpImage: '/images/talbott-waves.webp',
    closingImage: photo('photo-1460317442991-0ec209397118'),
    pageImage: '/images/hero-aerial.webp',
    // One unique hero per nav page (all 2880px, recolored blue)
    pageHeroes: {
      about: '/images/hero-ribbons.webp',
      strategy: '/images/hero-swirl.webp',
      portfolio: '/images/hero-aerial.webp',
      learn: '/images/hero-folds.webp',
      contact: '/images/hero-stacked.webp',
      offerings: '/images/hero-arcs.webp',
      webinars: '/images/hero-waves.webp',
    },
  },

  // About page. Fill name, role, bio, photo, LinkedIn as they arrive.
  advisors: [
    { name: 'Yohannes Cramlet', role: 'Advisor · Capitalyst Advisors', bio: '', photo: '', linkedin: '' /* Capitalyst Advisors page URL */ },
    { name: '[Advisor name]', role: '[Role]', bio: '', photo: '', linkedin: '' },
    { name: '[Advisor name]', role: '[Role]', bio: '', photo: '', linkedin: '' },
  ],
  // Vendors, legal counsel and other strategic partners (requested from Stephen)
  partners: [
    { name: '[Legal counsel]', role: 'Securities and fund counsel', url: '' },
    { name: '[Fund administrator]', role: 'Investor portal and reporting', url: '' },
    { name: '[CPA firm]', role: 'Tax and K-1 preparation', url: '' },
    { name: '[Operating partner]', role: 'Property management', url: '' },
  ],

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

  // Talbott's GHL Resources blog (blog815585), newest first. Cards link to the live posts.
  articleCategories: ['Tax Benefits', 'Investor Returns', 'Due Diligence', 'Finance', 'Terms', 'Benefits', 'Market Insights'],
  articles: [
    { title: 'The Hidden Tax Trap Software Engineering Leaders Face (and How To Escape It)', date: 'Jan 14, 2026', category: 'Tax Benefits', summary: 'The hidden tax trap, and how to escape it.', url: 'https://talbottinvestments.com/post/the-hidden-wealth-trip-of-software-engineering-leaders', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/6969425ce4cf740a0418c1d6.png' },
    { title: 'Preferred Return: The Term Every Real Estate Investor Should Know', date: 'Dec 31, 2025', category: 'Investor Returns', summary: 'Unlocking investor benefits: why preferred return matters in real estate deals.', url: 'https://talbottinvestments.com/post/preferred-return-the-term-every-real-estate-investor-should-know', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7edb8a250f4d935af.png' },
    { title: 'Why It\'s Never Too Late To Start Investing In Real Estate', date: 'Dec 25, 2025', category: 'Benefits', summary: 'Building wealth at any age: why real estate investing is always an option.', url: 'https://talbottinvestments.com/post/why-its-never-too-late-to-start-investing-in-real-estate', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7ec06c570e1ac840e.png' },
    { title: 'Why Real Estate Analysis Matters', date: 'Nov 27, 2025', category: 'Finance', summary: 'Studying real estate investments before you commit capital.', url: 'https://talbottinvestments.com/post/why-real-estate-analysis-matter', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a77ccb03e4f2578f73.png' },
    { title: 'The Importance of Due Diligence', date: 'Oct 22, 2025', category: 'Due Diligence', summary: 'Mitigating risk and maximizing returns: why due diligence is essential for smart investing.', url: 'https://talbottinvestments.com/post/the-importance-of-due-diligence-', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7c0d43292cea32ddd.png' },
    { title: 'What Markets are Best for Private Real Estate Investments', date: 'Sep 23, 2025', category: 'Due Diligence', summary: 'Finding the goldmine: how to identify the best markets for private real estate investments.', url: 'https://talbottinvestments.com/post/what-markets-are-best-for-private-real-estate-investments', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7c0d4321cf0a32ddc.png' },
    { title: 'What is a Waterfall Structure in Real Estate Finance', date: 'Aug 12, 2025', category: 'Finance', summary: 'Follow the money flow: breaking down the waterfall structure in investing.', url: 'https://talbottinvestments.com/post/what-is-a-waterfall-structure-in-real-estate-finance-', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7ec06c50813ac840f.png' },
    { title: 'What is the Capital Stack in Real Estate Finance', date: 'Jul 24, 2025', category: 'Finance', summary: 'Decoding the capital stack: debt, equity, and risk in real estate finance.', url: 'https://talbottinvestments.com/post/what-is-the-capital-stack-in-real-estate-finance', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a78224763408b51303.png' },
    { title: 'Return of Capital Vs. Return on Capital', date: 'Jun 20, 2025', category: 'Investor Returns', summary: 'The key difference between return of capital and return on capital.', url: 'https://talbottinvestments.com/post/return-of-capital-vs-return-on-capital', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7c0d4323deba32dd8.png' },
    { title: 'Investing in Real Estate with a Self Directed IRA: Pros and Cons', date: 'Apr 9, 2025', category: 'Tax Benefits', summary: 'The benefits and risks of using a self-directed IRA for private real estate investing.', url: 'https://talbottinvestments.com/post/investing-in-real-estate-with-a-self-directed-ira-pros-and-cons', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a788fd1a5fd5145228.png' },
    { title: 'How Cost Segregation Affects Your Taxes', date: 'Mar 16, 2025', category: 'Tax Benefits', summary: 'How cost segregation can boost your real estate returns.', url: 'https://talbottinvestments.com/post/how-cost-segregation-affects-your-taxes', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a79e7c133350104a80.png' },
    { title: 'Accredited Investor VS. Non Accredited Investor', date: 'Feb 6, 2025', category: 'Terms', summary: 'Understanding the key differences, and where you stand.', url: 'https://talbottinvestments.com/post/accredited-investor-vs-non-accredited-investor', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7ec06c58a7fac8409.png' },
    { title: 'Passive Investing Terms You Should Know', date: 'Jan 15, 2025', category: 'Terms', summary: 'Essential terminology for passive investors in real estate and alternative investments.', url: 'https://talbottinvestments.com/post/passive-investing-terms-you-should-know-', cover: 'https://storage.googleapis.com/msgsndr/wcZcbuIFekpLyE3fmvmO/media/695420a7ec06c5732dac840a.png' },
  ],
};
