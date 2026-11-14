# Talbott Investments website

Static site for talbottinvestments.com, built from the Approachable Authority template
(`hpintojr/investor-website-templates`) and the GoRaise.ai brief
"Talbott_Website_Build_Brief_and_Copy_FINAL_11.11.2026".

- `npm run build` writes `dist/`. Vercel uses `vercel.json` (no dependencies).
- **Copy, properties, assets, GHL embed IDs:** `content/site.mjs`
- **Webinar content the VA edits monthly:** `content/webinars.json` (live webinar, evergreen, replays). Add a replay by copying a block in `replays`.
- **GHL custom values:** `scripts/sync-ghl.mjs` runs before each build and fills `webinars.json > live` from Talbott's GHL custom values when `GHL_API_TOKEN` and `GHL_LOCATION_ID` are set in Vercel.
- Forms and the calendar render a labeled slot until the embed ID is pasted into `content/site.mjs > ghl`.
- Empty asset fields render a labeled placeholder. Stock hero photos are placeholders until Talbott photos arrive.
- `noindex` is on (header + meta) until launch. This site will later be copied 1:1 into GHL.
