// Live GHL custom values for the webinar pages. The GHL key lives only in Vercel env vars
// (GHL_API_TOKEN, a Private Integration token with locations/customValues.readonly, and
// GHL_LOCATION_ID); it never reaches the page. public/site.js swaps these values into any
// element marked data-cv / data-cv-href / data-cv-src / data-cv-poster.
import { fetchGhlValues } from '../lib/ghl-values.mjs';

export default async function handler(req, res) {
  const token = process.env.GHL_API_TOKEN;
  const location = process.env.GHL_LOCATION_ID;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!token || !location) { res.statusCode = 503; return res.end(JSON.stringify({ error: 'GHL not configured' })); }
  try {
    const values = await fetchGhlValues(token, location);
    // Edge-cached for a minute, then served stale while it refreshes in the background.
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    res.end(JSON.stringify({ values }));
  } catch (err) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'Could not reach GHL' }));
  }
}
