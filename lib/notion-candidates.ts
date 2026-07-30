// Shared Notion API helpers for the Candidates DB — used by /api/apply, /api/auth/*, /api/profile.
// Centralizes the fetch+auth boilerplate that used to live only in app/api/apply/route.ts.

const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function authHeaders(): Record<string, string> {
  const { NOTION_TOKEN } = process.env;
  if (!NOTION_TOKEN) throw new Error('Missing NOTION_TOKEN env var');
  return {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

function databaseId(): string {
  const { NOTION_DATABASE_ID } = process.env;
  if (!NOTION_DATABASE_ID) throw new Error('Missing NOTION_DATABASE_ID env var');
  return NOTION_DATABASE_ID;
}

export function txt(content: string | undefined | null) {
  if (!content) return [];
  return [{ type: 'text', text: { content: String(content).slice(0, 2000) } }];
}

export type CandidateRecord = {
  id: string;
  email: string | null;
  name: string | null;
  category: string | null;
  company: string | null;
  role: string | null;
  linkedin: string | null;
  stravaProfile: string | null;
  proWebsite: string | null;
  otherLink: string | null;
  city: string | null;
  country: string | null;
  sportLevel: string | null;
  selfDescription: string | null;
  motivation: string | null;
  lookingFor: string | null;
  profilePictureUrl: string | null;
  preferredLanguage: 'FR' | 'EN' | null;
  sessionLabels: string[];
};

// Minimal shape of what we read out of a Notion property value — avoids pulling in Notion's SDK.
type NotionProperty = {
  type?: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  select?: { name: string } | null;
  multi_select?: { name: string }[];
  url?: string | null;
  email?: string | null;
};

function richText(prop?: NotionProperty): string | null {
  const value = prop?.rich_text?.map((t) => t.plain_text).join('');
  return value || null;
}
function titleText(prop?: NotionProperty): string | null {
  const value = prop?.title?.map((t) => t.plain_text).join('');
  return value || null;
}
function selectName(prop?: NotionProperty): string | null {
  return prop?.select?.name ?? null;
}
function urlValue(prop?: NotionProperty): string | null {
  return prop?.url ?? null;
}
function emailValue(prop?: NotionProperty): string | null {
  return prop?.email ?? null;
}
function multiSelectNames(prop?: NotionProperty): string[] {
  return prop?.multi_select?.map((o) => o.name) ?? [];
}

function toCandidateRecord(page: { id: string; properties: Record<string, NotionProperty> }): CandidateRecord {
  const p = page.properties;
  return {
    id: page.id,
    email: emailValue(p['Email']),
    name: titleText(p['Name']),
    category: selectName(p['Category']),
    company: richText(p['Company']),
    role: richText(p['Role / Title']),
    linkedin: urlValue(p['LinkedIn']),
    stravaProfile: urlValue(p['Strava profile']),
    proWebsite: urlValue(p['Pro website']),
    otherLink: urlValue(p['Other link']),
    city: selectName(p['City']),
    country: richText(p['Country']),
    sportLevel: selectName(p['Sport level']),
    selfDescription: richText(p['Self-description']),
    motivation: richText(p['Motivation']),
    lookingFor: richText(p['Looking for']),
    profilePictureUrl: urlValue(p['Profile picture URL']),
    preferredLanguage: (selectName(p['Preferred language']) as 'FR' | 'EN' | null) ?? null,
    sessionLabels: multiSelectNames(p['Session']),
  };
}

// Multiple Candidates rows can share an email (repeat applicants) — most recently created wins.
export async function findCandidateByEmail(email: string): Promise<CandidateRecord | null> {
  const res = await fetch(`${NOTION_API_URL}/databases/${databaseId()}/query`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      filter: { property: 'Email', email: { equals: email } },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 1,
    }),
  });
  if (!res.ok) {
    console.error('Notion query error', res.status, await res.text());
    return null;
  }
  const body = await res.json();
  const page = body.results?.[0];
  return page ? toCandidateRecord(page) : null;
}

export async function getCandidateById(id: string): Promise<CandidateRecord | null> {
  const res = await fetch(`${NOTION_API_URL}/pages/${id}`, { headers: authHeaders() });
  if (!res.ok) return null;
  return toCandidateRecord(await res.json());
}

export async function updateCandidateProperties(
  id: string,
  properties: Record<string, unknown>,
): Promise<boolean> {
  const res = await fetch(`${NOTION_API_URL}/pages/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    console.error('Notion update error', res.status, await res.text());
    return false;
  }
  return true;
}

export async function createCandidatePage(
  properties: Record<string, unknown>,
): Promise<{ id: string; url: string } | { error: string }> {
  const res = await fetch(`${NOTION_API_URL}/pages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ parent: { database_id: databaseId() }, properties }),
  });
  const body = await res.json();
  if (!res.ok) {
    const detail =
      body.message || (body.code ? `code: ${body.code}` : null) || `HTTP ${res.status}`;
    return { error: detail };
  }
  return { id: body.id, url: body.url };
}

export async function markEmailVerified(id: string): Promise<boolean> {
  return updateCandidateProperties(id, {
    'Email verified': { checkbox: true },
    'Email verified at': { date: { start: new Date().toISOString().slice(0, 10) } },
  });
}
