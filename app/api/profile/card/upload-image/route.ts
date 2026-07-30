/**
 * Batch 5.3 — POST /api/profile/card/upload-image
 *
 * Session-gated. Accepts the client-rasterized Member Card PNG (captured from the actual
 * rendered DOM via html-to-image) and stores it in Vercel Blob. Distinct from
 * /api/profile/upload (profile photo) — doesn't set the Notion page cover, different blob
 * path. The resulting URL gets saved to the "Card image URL" Notion property by
 * /api/profile/card/validate, so Etienne can open/download it straight from Notion when
 * posting to WhatsApp — no separate admin UI needed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSessionFromRequest } from '@/lib/auth';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function findBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const key = Object.keys(process.env).find((k) => k.endsWith('_READ_WRITE_TOKEN'));
  return key ? process.env[key] : undefined;
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let file: File | null;
  try {
    const formData = await req.formData();
    file = formData.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
  }

  const token = findBlobToken();
  if (!token) {
    console.error('No *_READ_WRITE_TOKEN env var found for Vercel Blob');
    return NextResponse.json({ error: 'Upload failed — is Vercel Blob configured?' }, { status: 500 });
  }

  try {
    const blob = await put(`member-cards/${session.candidateId}.png`, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Card image upload failed', err);
    return NextResponse.json({ error: 'Upload failed — is Vercel Blob configured?' }, { status: 500 });
  }
}
