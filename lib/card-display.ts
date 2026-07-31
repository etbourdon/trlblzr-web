// Batch 7 — shared derivation logic used wherever a CandidateRecord needs to become a rendered
// MemberCard (app/profile, the new app/directory/** pages) or a WhatsApp-group routing decision.

import type { CandidateRecord } from '@/lib/notion-candidates';

// Mirrors app/profile/page.tsx's own metaLine/sportLevel derivation exactly, applied to a
// CandidateRecord instead of the profile page's local FormState.
export function deriveCardMeta(
  c: Pick<CandidateRecord, 'city' | 'otherCity' | 'role' | 'company' | 'country' | 'sportLevel'>,
): { metaLine: string; sportLevelNumber: number | null } {
  const cityDisplay = c.city === 'Autre' ? c.otherCity : c.city;
  const metaLine = [
    [c.role, c.company].filter(Boolean).join(' @ '),
    [cityDisplay, c.country].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join(' · ');
  const sportLevelNumber = c.sportLevel ? parseInt(c.sportLevel, 10) : null;
  return { metaLine, sportLevelNumber };
}

// Alumni-ness is earned by attending past WE (weekend) events, tracked via the "WE Participation"
// Notion multi-select — 1+ stars (1+ WEs attended) counts as alumni. Deliberately agnostic to the
// actual option label strings (e.g. "WE #1" vs a future "// 0003 Vercors 03-26") — only the
// count matters, so renaming/adding options in Notion never requires a code change.
export function isAlumni(candidate: Pick<CandidateRecord, 'weParticipation'>): boolean {
  return candidate.weParticipation.length >= 1;
}
