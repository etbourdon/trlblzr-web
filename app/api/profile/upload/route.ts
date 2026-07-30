/**
 * Batch 5.1 follow-up — POST /api/profile/upload
 *
 * Session-gated. Accepts a single image file (multipart/form-data, field name "file"),
 * uploads it to Vercel Blob, and returns its public URL. The client then saves that URL
 * into the profile form like any other field (via PATCH /api/profile) — this route only
 * handles the upload itself, it doesn't touch Notion.
 *
 * Requires BLOB_READ_WRITE_TOKEN (see APPLY_BACKEND.md) — a Vercel Blob store connected
 * to this project. Without it, uploads fail with a clear error; nothing else breaks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSessionFromRequest } from '@/lib/auth';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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

  try {
    const ext = file.type.split('/')[1] || 'jpg';
    const blob = await put(`profile-photos/${session.candidateId}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Blob upload failed', err);
    return NextResponse.json({ error: 'Upload failed — is Vercel Blob configured?' }, { status: 500 });
  }
}
