# Investor website templates

Three responsive investor website templates built from the public reference layouts. The preview index links to all three.

| Path | Theme | Reference |
| --- | --- | --- |
| /approachable/ | Approachable Authority | https://hyleecapital.com/ |
| /bold/ | Bold & Data-Forward | https://momentummultifamily.com/ |
| /institutional/ | Modern Institutional | https://www.birgo.com/capital |

Run `npm run build` and serve `dist` using a static HTTP server. On Vercel, import this repository using the root directory and the settings in `vercel.json`. No install-time dependencies or environment variables are required.

## Adapt to a firm

- Edit the firm name, headlines, section copy, sample assets, contact details and links in `content.mjs`. Each theme has its own record.
- Set `portalUrl` to the firm's investor portal and `contactUrl` to its booking page or contact address. Until set, the CTA leads to the demo contact section.
- Replace the sample imagery URLs with firm-owned assets. Local files in `public/` are copied to the output. Update the theme CSS in `public/site.css`.
- Populate portfolio data, metrics, testimonials and disclosures with approved material. Demo values are labeled. This repo supplies full site templates. Investor authentication and lead collection are external integrations.
- To use a single theme at the root, set `TEMPLATE_THEME` to `approachable`, `bold`, or `institutional` in the build environment. The chosen homepage replaces the gallery at `/`. Remove the no-index settings in `vercel.json` and the HTML head generator when the branded site is ready for indexing.


## Motion and reference media

The homepages have independent scroll effects, including fixed navigation, section reveals and looping property sliders where applicable. Birgo’s video hero and two reference images are linked for visual comparison. Replace these URLs in `content.mjs` with media approved for the destination firm. The hero uses its poster if video playback is unavailable or the visitor requests reduced motion.

## Website scope and CRM handoff

The Summit Ridge webinars build at https://goraise-modern-institutional.vercel.app/webinars is the scope and flow reference. The Approachable, Bold, and Institutional demos are the design references for the new pages. The website scope is separate from the AI agent discussed on the call.

Each theme has Home, About / Team, Strategy, Track Record, Offerings, Insights, Webinars, Contact, and Legal. The property and case study layouts, sample offering, article and quick-answer layouts, webinar registration and replay flows, and confirmation pages sit beneath those routes. The global newsletter block previews the Capital Allocator Brief.

For the GHL build first and the Sulus rebuild second, reproduce the sections in page order, using theme styles from `public/site.css` and the content and page definitions in `content.mjs` and `investor-pages.mjs`. Use native forms and workflows to replace the demo fields and redirect to the equivalent confirmation page. The `data-crm-field` attributes identify demo fields. Fields intentionally have no names in the demo, so submission navigates without sending their values.

| Integration | Template setting or replacement |
| --- | --- |
| Newsletter and confirmations | `integrations.newsletter` or a native email form, then `newsletter/thank-you/` |
| Live registration | `integrations.webinar` or a native registration form, then `webinars/thank-you/` and the approved calendar invite |
| On-demand brief | `integrations.investorBrief` and `integrations.briefVideo`; implement approved access and viewing workflows in the CRM |
| Replay and about videos | `integrations.replayVideo`, `integrations.aboutVideo`, and `integrations.founderVideo` |
| Investor inquiry and booking | `integrations.contact`, `contactUrl`, and approved routing for the inquiry fields |
| Waitlist and investor access | `integrations.waitlist`, `portalUrl`, and the firm-approved offering access model |

The generated sample offering is illustrative and publicly accessible by its direct demo URL. Set `offeringMode` to `relationship` for the investor-list layout without sample fund pages. For real offering access, use the approved portal and firm-specific compliance requirements. Configure production integrations in each destination. Replace the sample figures, people, media, policies, and articles with approved material, including any of the client's existing articles that are in scope.


