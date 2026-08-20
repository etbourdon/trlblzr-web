/**
 * Batch 5.1 follow-up — POST /api/profile/upload
 *
 * Session-gated. Accepts a single image file (multipart/form-data, field name "file"),
 * uploads it to Vercel Blob, and returns its public URL.
 *
 * SBL-26 follow-up: also persists the new URL to Notion immediately (Profile picture URL +
 * page cover), so a photo change is saved on its own rather than waiting for the separate
 * "Enregistrer" submit — a photo click-to-change shouldn't have a second, easy-to-miss step.
 * Deliberately narrow: only this one field, so it can't accidentally save other in-progress,
 * possibly-invalid edits elsewhere on the form the way a full profile PATCH could.
 *
 * Requires a Vercel Blob store connected to this project (see APPLY_BACKEND.md). Note:
 * Vercel prefixes the injected token env var with the store's name (e.g. a store named
 * "BlobPublic" gives BLOBPublic_READ_WRITE_TOKEN, not the plain BLOB_READ_WRITE_TOKEN) —
 * findBlobToken() below checks the plain name first, then falls back to scanning for any
 * *_READ_WRITE_TOKEN var so this keeps working regardless of the store's name. Without a
 * token, uploads fail with a clear error; nothing else breaks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSessionFromRequest } from '@/lib/auth';
import { updateCandidateProperties } from '@/lib/notion-candidates';

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
    const ext = file.type.split('/')[1] || 'jpg';
    const blob = await put(`profile-photos/${session.candidateId}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    try {
      await updateCandidateProperties(
        session.candidateId,
        { 'Profile picture URL': { url: blob.url } },
        { coverImageUrl: blob.url },
      );
    } catch (err) {
      // Best-effort — the photo is uploaded either way; the client still holds the URL and
      // the next full profile save will persist it if this one write hiccups.
      console.error('Failed to save photo URL to Notion', err);
    }

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Blob upload failed', err);
    return NextResponse.json({ error: 'Upload failed — is Vercel Blob configured?' }, { status: 500 });
  }
}
