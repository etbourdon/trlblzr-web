/**
 * SBL-35 — POST /api/profile/archetype
 *
 * Session-gated. Takes the 11 quiz answers, scores the archetype deterministically (no LLM
 * involved in the label itself), asks Claude to write up the personalized private analysis
 * around that already-decided result, then persists everything to the candidate's Notion row.
 * Retaking the quiz simply overwrites the previous result — no separate "attempt" history.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getCandidateById, updateCandidateProperties, longTxt } from '@/lib/notion-candidates';
import { isComplete, scoreArchetype, type ArchetypeAnswers } from '@/lib/archetype';
import { generateArchetypeAnalysis } from '@/lib/archetype-generation';

type ArchetypeBody = {
  answers?: ArchetypeAnswers;
};

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let data: ArchetypeBody;
  try {
    data = (await req.json()) as ArchetypeBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const answers = data.answers || {};
  if (!isComplete(answers)) {
    return NextResponse.json({ error: 'Incomplete answers' }, { status: 400 });
  }

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { primary, secondary } = scoreArchetype(answers);
    const firstname = (candidate.name || '').split(' ')[0] || candidate.name || '';

    const analysis = await generateArchetypeAnalysis({
      firstname,
      isAthlete: candidate.category === 'Athlète',
      primary,
      secondary,
      answers,
      selfDescription: candidate.selfDescription,
      motivation: candidate.motivation,
      preferredLang: candidate.preferredLanguage === 'EN' ? 'EN' : 'FR',
    });

    const ok = await updateCandidateProperties(session.candidateId, {
      Archetype: { select: { name: primary } },
      'Secondary Archetype': { select: { name: secondary } },
      'Archetype Analysis': { rich_text: longTxt(analysis) },
      'Archetype Completed At': { date: { start: new Date().toISOString().slice(0, 10) } },
    });
    if (!ok) return NextResponse.json({ error: 'Failed to save result' }, { status: 502 });

    return NextResponse.json({ ok: true, primary, secondary, analysis });
  } catch (err) {
    console.error('POST /api/profile/archetype failed', err);
    return NextResponse.json(
      { error: 'Generation failed — is ANTHROPIC_API_KEY configured?' },
      { status: 500 },
    );
  }
}
