// Pulls the live webinar fields from Talbott's GHL custom values into content/webinars.json.
// Runs before every build. Needs GHL_API_TOKEN (Private Integration token with
// locations/customValues.readonly) and GHL_LOCATION_ID. Without them it leaves the file as is.
import { readFile, writeFile } from 'node:fs/promises';

const token = process.env.GHL_API_TOKEN;
const location = process.env.GHL_LOCATION_ID;
if (!token || !location) {
  console.log('sync-ghl: GHL_API_TOKEN / GHL_LOCATION_ID not set, using content/webinars.json as is');
  process.exit(0);
}

// GHL custom value name (lowercased, partial match) -> webinars.json "live" field.
// Names come from the Webinar Builder form at events.talbottinvestments.com/webinar-funnel-builder.
const map = [
  [/webinar name.*sub/, 'subtitle'],
  [/webinar name/, 'title'],
  [/webinar date/, 'date'],
  [/webinar time/, 'time'],
  [/speaker|host/, 'host'],
  [/what you will learn/, 'whatYouWillLearn'],
  [/about (this )?webinar/, 'about'],
  [/calendar/, 'addToCalendarUrl'],
  [/(marketing )?cover|flyer/, 'flyer'],
  [/thank ?you video/, 'thankYouVideo'],
];

try {
  const res = await fetch(`https://services.leadconnectorhq.com/locations/${location}/customValues`, {
    headers: { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { customValues = [] } = await res.json();
  const file = new URL('../content/webinars.json', import.meta.url);
  const data = JSON.parse(await readFile(file, 'utf8'));
  let n = 0;
  for (const { name = '', value = '' } of customValues) {
    const hit = map.find(([re]) => re.test(name.toLowerCase()));
    if (!hit || !String(value).trim()) continue;
    const key = hit[1];
    data.live[key] = key === 'whatYouWillLearn'
      ? String(value).split(/\r?\n|<\/?li>|•/).map((s) => s.replace(/<[^>]+>/g, '').trim()).filter(Boolean)
      : String(value).trim();
    n++;
  }
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`sync-ghl: updated ${n} live webinar fields from GHL`);
} catch (err) {
  console.warn('sync-ghl: could not reach GHL, keeping content/webinars.json:', err.message);
}
