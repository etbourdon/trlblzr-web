/**
 * TRLBLZR.RUN — Apply submission endpoint
 * ------------------------------------------------
 * Receives POST from apply.html and creates a page in Notion.
 *
 * Compatible with Vercel Serverless Functions (Node 18+) out of the box.
 * Place this file at `api/apply.js` at the root of your Vercel project.
 *
 * Required environment variables (set in Vercel dashboard → Settings → Environment Variables) :
 *   - NOTION_TOKEN       : integration secret token (starts with `secret_` or `ntn_`)
 *   - NOTION_DATABASE_ID : ID of the candidatures database (the 32-char string in the URL)
 *
 * See SETUP_NOTION.md for full setup instructions.
 */

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

const SESSION_LABELS = {
  'annecy-mai-2026': 'Annecy — Mai 2026 · Performance',
  'vercors-juillet-2026': 'Vercors — Juillet 2026 · Longévité',
  '': '— Sans session ciblée —',
};

function jsonResponse(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(status).send(JSON.stringify(body));
}

function txt(content) {
  if (!content) return [];
  return [{ type: 'text', text: { content: String(content).slice(0, 2000) } }];
}

module.exports = async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') return jsonResponse(res, 204, {});
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method Not Allowed' });

  const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID env vars');
    return jsonResponse(res, 500, { error: 'Server not configured' });
  }

  let data;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return jsonResponse(res, 400, { error: 'Invalid JSON body' });
  }

  if (!data || !data.firstname || !data.lastname || !data.email || !data.rgpd) {
    return jsonResponse(res, 400, { error: 'Missing required fields' });
  }

  const fullName = `${data.firstname} ${data.lastname}`.trim();
  const sessionLabel = SESSION_LABELS[data.session || ''] || data.session || '— Sans session ciblée —';
  const isAthlete = data.category === 'athlete';

  // Map form payload to Notion properties.
  // The property names must EXACTLY match those in your Notion database.
  const properties = {
    'Name': { title: txt(fullName) },
    'Email': { email: data.email },
    'WhatsApp': { phone_number: data.whatsapp || null },
    'LinkedIn': { url: data.linkedin || null },
    'Category': { select: { name: isAthlete ? 'Athlète' : 'Dirigeant' } },
    'Session': { select: { name: sessionLabel } },
    'Status': { select: { name: 'Nouveau' } },
    'Company': { rich_text: txt(data.company) },
    'ITRA': { rich_text: txt(data.itra) },
    'UTMB': { rich_text: txt(data.utmb) },
    'Source': { rich_text: txt(data.referer || 'apply.html') },
  };

  // Remove empty optional properties (Notion accepts nulls for email/url/phone_number; otherwise skip)
  Object.keys(properties).forEach(key => {
    const p = properties[key];
    if (p.rich_text && p.rich_text.length === 0) delete properties[key];
  });

  try {
    const notionRes = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties,
      }),
    });

    const notionBody = await notionRes.json();
    if (!notionRes.ok) {
      console.error('Notion API error', notionRes.status, notionBody);
      return jsonResponse(res, 502, { error: 'Notion API rejected the request', details: notionBody.message || null });
    }

    return jsonResponse(res, 200, {
      ok: true,
      reference: `TRLBLZR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      notion_id: notionBody.id,
    });
  } catch (err) {
    console.error('Server exception', err);
    return jsonResponse(res, 500, { error: 'Internal server error' });
  }
};
