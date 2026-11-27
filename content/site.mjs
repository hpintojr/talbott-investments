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
  companyLinkedinUrl: 'https://www.linkedin.com/company/talbott-investments/',
  // Stephen's personal profile (About page, next to his bio)
  linkedinUrl: 'https://www.linkedin.com/in/stephen-predmore/',
  portalUrl: 'https://talbottinvestments.fundamentalportal.com/',
  // Real CTAs from Talbott's GHL funnels
  discoveryCallUrl: 'https://connect.talbottinvestments.com/company-scheduler',
  introCallUrl: 'https://connect.talbottinvestments.com/invest-stephen',
  // Thank-you video shared by the newsletter and webinar confirmation pages (Drive "11. Thank You Video")
  // GHL custom value "9 Evergreen Thank You-Schedule A Call Video URL"
  thankYouVideo: 'https://assets.cdn.filesafe.space/wcZcbuIFekpLyE3fmvmO/media/69d405474cde4bbc2a0d5ba7.mp4',
  newsletterName: 'The Engineering Collective',

  // Assets from Drive "23. Website" folder. Leave '' for a placeholder.
  assets: {
    // Logo Light / Logo Dark from GHL custom values; favicon cropped from the mark
    logo: '/images/logo.png',
    logoWhite: '/images/logo-white.png',
    favicon: '/images/favicon.png',
    headshot: '/images/stephen-profile.webp',
    headshotCutout: '/images/stephen-predmore.webp',
    // Nov 19 per Yohannes ("About Page-Talbott Investments"): About page media follow GHL custom values.
    // Our Firm = {{custom_values.6_evergreen_about_us}} + {{custom_values.11_about_us_cover_image}};
    // Stephen's Founder's Story = {{custom_values.7_about_me}} + {{custom_values.8_about_me_video_thumbnail}}.
    // On GHL the About page uses the tokens themselves (scripts/ghl-custom-values.json), so edits there flow through.
    aboutUsVideo: 'https://assets.cdn.filesafe.space/wcZcbuIFekpLyE3fmvmO/media/6a3946427b00529580989d24.mp4',
    aboutUsPoster: 'https://files.leadconnectorhq.com/file/6aff4a66898cec9ac76a4b88/talbott-aboutus-video-thumbnail-1920.png',
    aboutMeVideo: 'https://assets.cdn.filesafe.space/wcZcbuIFekpLyE3fmvmO/media/69d405474cde4bbc2a0d5ba7.mp4',
    aboutMePoster: 'https://files.leadconnectorhq.com/file/6aff4e8fff777b8c6ec001d7/talbott-aboutme-video-thumbnail-concept.png',
    briefThumbnail: '',
    // Stock placeholders until Talbott property photos arrive
    // Heroes: blue versions of the Hylee-style images Hamilton picked (public/images/hero-*.webp).
    // Home hero = the long multifamily building.
    heroImage: '/images/hero-building.webp',
    helpImage: '/images/talbott-waves.webp',
    closingImage: '/images/hero-arcs.webp',
    pageImage: '/images/hero-aerial.webp',
    // Strategy page (Yohannes Nov 25-26): Rise Avalon photo cropped from its cover (no cover text),
    // the Sun Belt map from his Nov 26 email, and a licensed Unsplash photo for Deal Structure and Risk.
    strategyFocusImage: '/images/strategy/investment-focus.webp',
    targetMarketsMap: '/images/strategy/sunbelt-map.webp',
    strategyDealImage: '/images/strategy/deal-review.webp',
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

  // Stephen's About page bio (Drive "Stephen Predmore-Bio.docx", Nov 15 2026)
  stephenBio: [
    'Stephen Predmore is the Managing Partner of Talbott Investments, where he leads investment selection, due diligence, and capital formation. Since 2019, he has invested in multifamily, hospitality, and self-storage assets as both an active and passive investor.',
    'Stephen oversees every stage of the investment process: evaluating markets, screening opportunities against Talbott’s acquisition criteria, and underwriting each deal with conservative assumptions and downside scenarios. He partners exclusively with established operating firms that have the scale, systems, and track record to execute the business plan.',
    'He also leads capital formation and investor relations, working directly with investors from the first conversation through ongoing reporting and distributions. Stephen holds a B.S. in Mechanical Engineering from the University at Buffalo and is a licensed Professional Engineer, which shapes his disciplined, data driven approach to evaluating risk.',
    'Outside of Talbott, Stephen volunteers in construction with Habitat for Humanity and is an Eagle Scout. He grew up in Rochester, New York, the youngest of seven children, and now lives in Maryland with his wife.',
  ],
  // About page. Fill name, role, bio, photo, LinkedIn as they arrive.
  advisors: [
    { name: 'Mike Ealy', role: 'Advisor · Nassau Investments', photo: '/images/mike-ealy.webp', linkedin: 'https://www.linkedin.com/in/nassaumikeealy/',
      bio: 'Mike built Nassau Investments into one of the leading development firms in the Cincinnati area. Over more than 20 years, he has applied his property and asset management experience to hundreds of successful real estate transactions, with a particular strength for selecting the right projects and assembling the teams to execute them.' },
    { name: 'Yohannes Cramlet', role: 'Advisor · Cramlet Capital', photo: '/images/yohannes-cramlet.webp', linkedin: 'https://www.linkedin.com/in/yohannesc',
      bio: 'Yohannes is the Founder of Cramlet Capital, a multifamily investment firm with a portfolio of approximately $410 million. Since 1999, he has been involved in more than $2 billion in commercial real estate transactions, with prior roles at Village Green Companies, Cedar Signature Homes, and Marcus & Millichap’s investment sales group.' },
    { name: 'John Casmon', role: 'Advisor · Casmon Capital Group', photo: '/images/john-casmon.webp', linkedin: 'https://www.linkedin.com/in/multifamily-apartments-john-casmon/',
      bio: 'John launched Casmon Capital Group to help busy professionals invest in multifamily real estate, helping families invest in nearly $90 million of apartments. He hosts the Target Market Insights podcast, co-founded the Midwest Real Estate Networking Summit, and previously led marketing for General Motors, PepsiCo, and MillerCoors.' },
  ],
  // Vendors, legal counsel and other strategic partners (requested from Stephen).
  // Hidden on the About page per Yohannes (Nov 25); set showPartners: true to bring the section back.
  showPartners: false,
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
    newsletter: { id: 'EVSSI8VNXH9Ghd7aCkMg', where: 'Forms > 8. Article, Newsletter, Blogs > 2. Investor Newsletter' },
    newsletterHero: { id: 'erHRiRf7v9ZzyzqRok19', where: 'Forms > 8. Article, Newsletter, Blogs > 3. Investor Newsletter - Learn Hero' },
    getNotified: { id: 'AvWH3bYyEHHnIu6YiYJN', where: 'Forms > 9. Website Forms > 2. Get Notified About the Next Offering' },
    evergreen: { id: 'dNjByee01o9mOCAX4cmZ', where: 'Forms > 2. Evergreen Webinar > 1. Evergreen Webinar Registration' },
    liveWebinar: { id: '4j48BWsrlUr36REdk9fo', where: 'Forms > 3. Live Webinars > live webinar registration form' },
    contact: { id: 'DRxpB4co0ATUbZ1biBkv', where: 'Forms > 9. Website Forms > 1. Contact Form' },
    calendar: { id: 'WQWY7tLU92Q8FSr6tOpG', where: 'Calendars > Stephen Calendar Group > Investor Introduction Call - Stephen (30 min)' },
  },

  stats: [['17', 'Properties'], ['$297M', 'Portfolio Value'], ['2,041', 'Units'], ['10', 'States']],

  // name, location, type, size, year acquired, status, detail page slug, cover, sold date (realized only).
  // Covers: GoRaise Nov 25 2026 (Drive "Talbott_Property_Cover_*.png"), public/images/properties.
  // Order (Yohannes Nov 25): active newest to oldest, then realized, most recently sold first.
  properties: [
    ['Rise Bluestone', 'Raleigh, NC', 'Multifamily', '268 units', '2026', 'Active', 'rise-bluestone', '/images/properties/rise-bluestone.webp'],
    ['Rise Valley Heights', 'Phoenix, AZ', 'Multifamily', '194 units', '2026', 'Active', 'rise-valley-heights', '/images/properties/rise-valley-heights.webp'],
    ['Rise Avalon', 'Charlotte, NC', 'Multifamily', '240 units', '2025', 'Active', 'rise-avalon', '/images/properties/rise-avalon.webp'],
    ['Rise Sunridge', 'Charlotte, NC', 'Multifamily', '200 units', '2025', 'Active', 'rise-sunridge', '/images/properties/rise-sunridge.webp'],
    ['Rise Chapel Hill', 'Chapel Hill, NC', 'Multifamily', '144 units', '2025', 'Active', '', '/images/properties/rise-chapel-hill.webp'],
    ['Rise Crown View', 'Greensboro, NC', 'Multifamily', '119 units', '2025', 'Active', '', '/images/properties/rise-crown-view.webp'],
    ['S. Samuel Street Apartments', 'Charles Town, WV', 'Multifamily', '23 units', '2024', 'Active', '', '/images/properties/s-samuel-street-apartments.webp'],
    ['Northwood Apartments', 'Mount Airy, NC', 'Multifamily', '54 units', '2024', 'Active', '', '/images/properties/northwood-apartments.webp'],
    ['Cherry Street Apartments', 'Kernersville, NC', 'Multifamily', '12 units', '2024', 'Active', '', '/images/properties/cherry-street-apartments.webp'],
    ['Promenade Apartments', 'Greenwood, SC', 'Multifamily', '88 units', '2023', 'Active', '', '/images/properties/promenade-apartments.webp'],
    ['Alhambra Avenue', 'Baltimore, MD', 'Single family', '1 home', '2020', 'Active', '', '/images/properties/alhambra-avenue.webp'],
    ['Hilton Tapestry', 'Sarasota, FL', 'Hospitality', '155 units', '2021', 'Realized', '', '/images/properties/hilton-tapestry.webp', 'Oct 2025'],
    ['Taku Drive Apartments', 'Anchorage, AK', 'Multifamily', '30 units', '2023', 'Realized', '', '/images/properties/taku-drive-apartments.webp', 'Aug 2025'],
    ['Staybridge Suites', 'Fishers, IN', 'Hospitality', '146 keys', '2021', 'Realized', '', '/images/properties/staybridge-suites.webp', 'Jul 2025'],
    ['Marriott Courtyard', 'Columbus, OH', 'Hospitality', '145 keys', '2019', 'Realized', '', '/images/properties/marriott-courtyard.webp', 'Jun 2025'],
    ['Fort Worth Self Storage', 'Fort Worth, TX', 'Self storage', '221 units', '2023', 'Realized', '', '/images/properties/fort-worth-self-storage.webp', 'Jan 2025'],
    ['Richwood Avenue', 'Baltimore, MD', 'Single family', '1 home', '2020', 'Realized', '', '/images/properties/richwood-avenue.webp', 'Oct 2023'],
  ],

  // Rise detail pages (Yohannes Nov 25): per-deal Key Metrics. Other rows stay on the Sunridge copy.
  riseMetrics: {
    'rise-sunridge': { acquired: 'May 2025', renovation: 'About $4.25M', ltv: '68.3%' },
    'rise-bluestone': { acquired: 'May 2026', renovation: '$3.46M', ltv: '68.2%' },
    'rise-valley-heights': { acquired: 'Mar 2026', renovation: '$4.59M', ltv: '70.0%' },
    'rise-avalon': { acquired: 'Dec 2025', renovation: '$4.90M', ltv: '70.0%' },
  },

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
