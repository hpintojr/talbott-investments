const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

const building = photo('photo-1600607687939-ce8a6c25118c');
const exterior = 'https://images.squarespace-cdn.com/content/v1/61f9a1a0fb90157fbde33a70/1b72edeb-bf05-4a84-8714-5c0ed380c35f/shoootin-photo-17.jpg';
const city = photo('photo-1486406146926-c627a92ad1ab');
const team = photo('photo-1521737711867-e3b97375f902');
const office = photo('photo-1497366754035-f200968a6e72');
const apartment = photo('photo-1560448204-e02f11c3d0e2');

const assets = [
  ['Oak Court', 'Multifamily · Sample property', exterior],
  ['Meridian Commons', 'Residential · Sample property', apartment],
  ['West Market Center', 'Mixed use · Sample property', city],
  ['Parkside Residences', 'Residential · Sample property', building],
  ['Union Square', 'Commercial · Sample property', office],
];

const steps = [
  ['Explore the strategy', 'Review the firm’s approach, target markets and underwriting criteria.'],
  ['Speak with the team', 'Discuss your objectives, time horizon and questions.'],
  ['Review opportunities', 'Read the investment documents and evaluate the risks.'],
  ['Use the investor portal', 'Follow the firm’s onboarding process and access reporting.'],
];

export const themes = {
  approachable: {
    label: 'Approachable Authority', firm: 'Northline Capital', mark: ['NORTHLINE', 'CAPITAL'],
    headline: ['Make Your Capital Work', 'Toward What Matters.'],
    description: 'A clear path to private real estate and alternative investments.',
    heroImage: 'https://hyleecapital.com/wp-content/uploads/2026/05/Hylee-Capital-Gallery-Image-4-1-1920x1067.jpg',
    peopleImage: '/approachable-presenter.webp', peopleImageAlt: 'Illustrative portrait of a fictional investment educator', featureImage: office,
    introTitle: 'How Private Real Estate Can Generate Passive Income',
    introLinkLabel: 'Explore the Intro to Private Real Estate Investing',
    nav: [['About', 'about'], ['Portfolio', 'portfolio'], ['Learn', 'learn'], ['Invest With Us', 'contact']],
    primary: 'Book a Call', portal: 'LP Login', portalUrl: '', contactUrl: '', linkedinUrl: 'https://www.linkedin.com/',
    intro: 'Northline Capital helps professionals explore private investments through a disciplined review process and practical investor education.',
    benefits: [
      ['Investor-Led Diligence', 'We look at each opportunity through the lens of a long-term investor.'],
      ['Selective Access', 'Explore opportunities chosen for their fit with a defined investment strategy.'],
      ['Education First', 'Understand the structure, timeline and risks before deciding.'],
    ],
    helpTitle: 'Help Your Capital Work Harder Without the Complexity',
    helpDescription: 'Private investments can help diversify a portfolio beyond public markets. We help busy professionals understand opportunities, review the risks and terms, and decide whether an investment fits their goals.',
    educationPoster: 'https://hyleecapital.com/wp-content/uploads/2026/06/Hylee_Presentation_.png?ver=1790093170',
    educationUrl: 'https://hyleecapital.com/learn/',
    portfolioUrl: '',
    helpImage: 'https://hyleecapital.com/wp-content/uploads/2026/05/Hylee-Capital-BG-Image-6.jpg',
    closingImage: 'https://hyleecapital.com/wp-content/uploads/2026/05/Hylee-Capital-BG-Image-3.jpg',
    differentiatorImage: 'https://hyleecapital.com/wp-content/uploads/2026/05/Hylee-Capital-BG-Image-13.jpg',
    differentiatorIntro: 'Evaluating private investments takes time and access to the right information. We bring a clear process to the work, from screening an opportunity to explaining how it fits an investor’s goals.',
    testimonials: [
      ['Clear from the first conversation', 'Jordan M.', '8/6/2026', 'The introductory conversation gave me a clear sense of the investment process. The team walked through the structure, the fees, and what I should expect to receive after closing. I had time to review the materials and come back with questions. What helped most was having a written summary to refer to before deciding whether the opportunity fit my plans.'],
      ['Helpful answers and follow-up', 'Casey R.', '7/23/2026', 'I had several questions about the subscription documents and how updates would be shared. The team answered each one and explained where I could find the relevant details in the materials. The follow-up email made it easy to keep track of what we discussed.'],
      ['Straightforward education', 'Taylor K.', '5/17/2026', 'I was new to private real estate investing and wanted to understand what I was reviewing. The education materials gave me a starting point. By the time I booked an introductory call, I had a list of questions about the hold period and the risks.'],
      ['A well-organized process', 'Morgan L.', '5/7/2026', 'The team laid out the steps in advance and explained when each document would be available. I appreciated knowing whom to contact if a question came up. The process gave me room to review the details at my own pace.'],
      ['Thorough materials', 'Avery T.', '5/3/2026', 'The materials covered the market, the operating plan, and the key assumptions. I found it helpful to have those topics in one place so I could compare them with my own criteria. The team made time to discuss the parts I wanted to understand better.'],
    ],
    reasons: [
      ['Aligned decisions', 'We evaluate the incentives and responsibilities of each party.'],
      ['A clear view of terms', 'We explain what drives returns, costs and potential losses.'],
      ['A selective process', 'Each opportunity must meet predefined diligence criteria.'],
      ['A long-term relationship', 'We make room for questions before, during and after an investment.'],
    ],
    stats: [['$18M+', 'Capital Allocated'], ['120+', 'Deals Reviewed'], ['18', 'Years Experience'], ['95+', 'Investor Relationships']],
    assets: [
      ['Community Healthcare Fund', 'Medical real estate · Sample deal', 'https://hyleecapital.com/wp-content/uploads/2026/05/Health-Wealth-Fund-Series-2.jpg'],
      ['Regional Industrial Center', 'Industrial real estate · Sample deal', 'https://hyleecapital.com/wp-content/uploads/2026/05/New-Castle-Stainless-Plate.jpg'],
      ['Upstream Energy Fund', 'Energy · Sample deal', 'https://hyleecapital.com/wp-content/uploads/2026/05/Oak-and-Vine-Upstream-Energy.jpg'],
      ['Private Credit Fund', 'Private credit · Sample deal', 'https://hyleecapital.com/wp-content/uploads/2026/05/Private-Credit-Fund.jpg'],
      ['Oak Court', 'Residential real estate · Sample deal', 'https://hyleecapital.com/wp-content/uploads/2026/05/Red-River-Stone-Ridge.jpg'],
    ],
    steps,
  },
  bold: {
    label: 'Bold & Data-Forward', firm: 'Axis Multifamily', mark: ['AXIS MULTIFAMILY'],
    headline: ['Capital', 'in motion.', 'Real estate', 'with discipline.'],
    description: 'We identify, acquire and operate apartment communities in markets selected for their durable demand and operating potential.',
    heroImage: exterior, peopleImage: team,
    webinarArt: {
      brief: team,
      replay: 'https://images.squarespace-cdn.com/content/v1/61f9a1a0fb90157fbde33a70/d80c86a0-6a2c-4230-be65-f1f3003d47da/2-Apr+08+2026+09_32am-K3Fa.jpg',
    },
    featureImage: 'https://images.squarespace-cdn.com/content/v1/61f9a1a0fb90157fbde33a70/1b72edeb-bf05-4a84-8714-5c0ed380c35f/shoootin-photo-17.jpg',
    nav: [['About', 'about'], ['Offerings', 'offerings'], ['Portfolio', 'portfolio'], ['Team', 'team'], ['Services', 'services'], ['Resources', 'learn']],
    primary: 'Start investing', portal: 'Investor Portal', portalUrl: '', contactUrl: '', linkedinUrl: 'https://www.linkedin.com/',
    market: 'MULTIFAMILY · ACQUISITIONS · OPERATIONS',
    intro: 'Our operating teams focus on improving the resident experience and following through on each property’s business plan.',
    stats: [['$285M+', 'Transactions'], ['2,480', 'Units'], ['14', 'Communities'], ['6', 'Full-Cycle Deals']],
    facts: [['Founded', '2017'], ['HQ', 'Fort Worth, TX'], ['Minimum', '$50,000'], ['Avg. Hold', '3–5 years']],
    brands: [
      ['Residential Operations', 'On-site support and property management.'],
      ['Construction', 'Capital improvements and renovation oversight.'],
      ['Asset Management', 'Operating reviews and reporting.'],
      ['Resident Services', 'Day-to-day service and support for residents.'],
    ],
    assets, steps,
  },
  institutional: {
    label: 'Modern Institutional', firm: 'Harborfield Capital', mark: ['HARBORFIELD', 'CAPITAL'],
    headline: ['Investing in durable', 'American real estate.'],
    description: 'PRIVATE EQUITY REAL ESTATE INVESTMENT FIRM',
    heroImage: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/69e28d32478a6f31bc1b9b15_NoOverlay_VisionAssessmentHero_Draft3%20(1)_poster.0000000.jpg',
    heroVideo: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/69e28d32478a6f31bc1b9b15_NoOverlay_VisionAssessmentHero_Draft3%20(1)_mp4.mp4',
    peopleImage: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/6a05addb11fee1aa644d37de_BestExcited_BirgoAnnualMeeting2026.webp',
    marketMap: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/69e23594b8a4800be82f1c46_Birgo%20Heartland%20Map%20-%20for%20Navy%20BG.png',
    processImage: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/699443835f9cca4d22a4348f_Corporate_BirgoAnnualMeeting2026%20(1).jpg',
    skyline: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/63f5e6e0e4a94078fe6fc191_footer-background.avif',
    fundIcon: 'https://cdn.prod.website-files.com/5e5686326725fd46da32412b/5e8e765f975c5538d2328f13_bar-chart.webp',
    marketUrl: 'https://www.birgo.com/capital/why-the-heartland',
    insightsUrl: 'https://www.birgo.com/insights/capital',
    nav: [['Investments', 'offerings'], ['About', 'about'], ['FAQ', 'faq'], ['Insights', 'learn'], ['Contact', 'contact']],
    primary: 'Explore Investments', portal: 'Investors', portalUrl: '', contactUrl: '', linkedinUrl: 'https://www.linkedin.com/',
    intro: 'Our strategies give investors access to professionally operated real estate across carefully selected U.S. markets.',
    benefits: [
      ['Integrated operations', 'Investment and property teams work from the same operating plan.'],
      ['Resilient markets', 'We look for diverse local economies and durable housing demand.'],
      ['Disciplined underwriting', 'We test assumptions against multiple operating and exit scenarios.'],
    ],
    fund: { title: 'Sample Multifamily Fund', summary: 'A sample of how fund details and approved terms can be presented.', raised: 42_000_000, target: 80_000_000, terms: [['12–15%', 'Target IRR'], ['8%', 'Preferred Return'], ['7 years', 'Fund Life']] },
    stats: [['$325M+', 'Assets Under Management'], ['3,240+', 'Residential Units'], ['18.4%', 'Realized Gross IRR']],
    articles: [
      ['A multifamily fund joins Impact Foundation', 'A reference article on a giving platform and access to a real estate fund.', '6adf78348c40abdb5af0cbb6_Fund%20V%20on%20Impact%20Foundation%20-%20Website%20Title%201x1.png', 'fund-v-now-available-on-impact-foundation'],
      ['Reiturn opens an equity crowdfunding round', 'A reference article on how an investment platform opened its offering to the public.', '6a272123c044aa1266063010_1x1_thumbnail_CF%20launch.png', 'reiturn-begins-equity-crowdfunding-round'],
      ['A first acquisition in Kentucky', 'A reference article on expanding a multifamily portfolio into a new market.', '6a021fd7f054f35424d0bfc2_The-Views-at-Crescent-Hill-7.jpeg', 'birgo-capital-completes-first-acquisition-in-state-of-kentucky'],
    ],
    holdings: [
      ['Craigdell Gardens', 'New Kensington, PA', '6a9b4e5fa8380ca91ea3ecc9_15-Craigdell%20Gardens-%20after.jpg'],
      ['Allegheny City Stables Lofts', 'Pittsburgh, PA', '69f2339a2394d54d141c32e0_allegheny-city-stables.png'],
      ['Sylvan Ridge', 'Beaver Falls, PA', '6a9b508732978a18008ea48a_35-Sylvan-%20after.jpg'],
      ['Lofts at Terrain', 'Pittsburgh, PA', '6a9b4f40de8fe91b9d674949_23-Lofts%20at%20Terrain-%20after.jpg'],
      ['Commonwealth Building', 'Warrendale, PA', '6a9b4ddabc547de662b865e5_10-Common%20Wealth-%20after.jpg'],
    ],
    steps,
  },
};


