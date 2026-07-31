/**
 * Batch 5.2/5.3 — POST /api/profile/card/validate
 *
 * Session-gated. Saves the (possibly hand-edited) generated bio/lookingFor + the
 * client-rasterized card image URL, requires explicit consent, and sets Card status ->
 * "submitted" (awaiting admin review — done directly in Notion by flipping this same
 * property to "validated", no separate admin UI). Assigns the member's permanent
 * "Member No" the first time they submit; never reassigned afterward. Also clears any
 * prior suspension dates — re-submitting an edited card always goes back through review,
 * even if it was previously suspended.
 *
 * Sends a best-effort admin email (same Resend setup as Batch 4's apply notification) so
 * Etienne actually finds out a card is waiting — without it, nothing prompts a check of the
 * "Cards — Pending review" Notion view.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import {
  getCandidateById,
  updateCandidateProperties,
  getNextMemberNumber,
  txt,
} from '@/lib/notion-candidates';
import { sendEmail } from '@/lib/resend';
import { buildCardSubmittedEmail } from '@/lib/card-notification';
import { isAlumni } from '@/lib/card-display';

type ValidateBody = {
  bio?: string;
  lookingFor?: string;
  consent?: boolean;
  cardImageUrl?: string;
};

async function sendCardSubmittedNotification(input: {
  fullName: string;
  memberNo: number | null;
  bio: string;
  lookingFor: string;
  cardImageUrl?: string | null;
  notionUrl: string;
  isAlumni: boolean;
  cardPageUrl: string;
}) {
  try {
    const { NOTIFICATION_EMAIL } = process.env;
    const recipients = (NOTIFICATION_EMAIL || 'etienne@bourdon.com')
      .split(',')
      .map((addr) => addr.trim())
      .filter(Boolean);
    const { subject, html } = buildCardSubmittedEmail(input);
    await sendEmail({ to: recipients, subject, html });
  } catch (err) {
    console.error('Card submitted notification failed', err);
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let data: ValidateBody;
  try {
    data = (await req.json()) as ValidateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!data.bio || !data.lookingFor) {
    return NextResponse.json({ error: 'Generate a card before submitting' }, { status: 400 });
  }
  if (!data.consent) {
    return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
  }

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const properties: Record<string, unknown> = {
      'Card bio': { rich_text: txt(data.bio) },
      'Card looking for': { rich_text: txt(data.lookingFor) },
      'Card status': { select: { name: 'submitted' } },
      'Card consent': { checkbox: true },
      'Card suspended at': { date: null },
      'Card delete after': { date: null },
    };
    if (data.cardImageUrl) {
      properties['Card image URL'] = { url: data.cardImageUrl };
    }

    let memberNo = candidate.memberNo;
    if (memberNo == null) {
      memberNo = await getNextMemberNumber();
      properties['Member No'] = { number: memberNo };
    }

    const ok = await updateCandidateProperties(session.candidateId, properties);
    if (!ok) return NextResponse.json({ error: 'Failed to submit card' }, { status: 502 });

    await sendCardSubmittedNotification({
      fullName: candidate.name || 'Membre',
      memberNo,
      bio: data.bio,
      lookingFor: data.lookingFor,
      cardImageUrl: data.cardImageUrl,
      notionUrl: `https://www.notion.so/${session.candidateId.replace(/-/g, '')}`,
      isAlumni: isAlumni(candidate),
      cardPageUrl: `${req.nextUrl.origin}/directory/${memberNo}`,
    });

    return NextResponse.json({ ok: true, memberNo });
  } catch (err) {
    console.error('Card validate failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}
