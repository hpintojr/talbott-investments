// Shared by scripts/sync-ghl.mjs (build) and api/custom-values.js (runtime).
// Only these GHL custom value keys are ever exposed by the site.
export const KEYS = [
  // 8. Evergreen Webinar
  '1_evergreen_webinar_name', '2_evergreen_webinar_sub_header', 'linkedin_webinar_lead_magnet',
  '2_evergreen_webinar_video_url', '3_evergreen_webinar_social_media_cover',
  '6_evergreen_webinarlearn_1', '7_evergreen_webinar_learn_2', '8_evergreen_webinar_learn3', '9_evergreen_webinarlearn4',
  '7_evergreen_thank_youschedule_a_call', '10_thank_you_video_thumbnail',
  // 10. Webinars (Live Investor Briefing)
  'webinar_name', '20_webinar_name_subheader', 'webinar_date', 'webinar_time', 'webinar_guest_name',
  'webinar_marketing_cover', '0_about_this_event', 'webinar_event_calendar_link',
  '9_what_you_will_learn_1', '10_what_you_will_learn_2', '11_what_you_will_learn_3', '12_what_youll_learn_4',
];

// Reads the location's custom values from the GHL API and returns { key: value } for KEYS only.
export async function fetchGhlValues(token, location) {
  const res = await fetch(`https://services.leadconnectorhq.com/locations/${location}/customValues`, {
    headers: { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`GHL HTTP ${res.status}`);
  const { customValues = [] } = await res.json();
  const out = {};
  for (const cv of customValues) {
    const key = String(cv.fieldKey || '').replace(/[{}\s]/g, '').replace(/^custom_values\./, '');
    if (KEYS.includes(key)) out[key] = String(cv.value ?? '').trim();
  }
  return out;
}
