// Batch 7 — validates a `next` redirect-destination query param so "log in, then return to the
// page you wanted" can't be turned into an open redirect. Pure and dependency-free on purpose:
// this needs to be importable from both client components (app/login/page.tsx) and server
// routes/components, unlike lib/auth.ts, which gains a next/headers import in this same batch —
// next/headers cannot be bundled into client code, so the one piece both sides need lives here.
export function isSafeNextPath(path: string | null | undefined): path is string {
  if (typeof path !== 'string' || path.length === 0) return false;
  if (path[0] !== '/') return false; // must be relative
  if (path[1] === '/' || path[1] === '\\') return false; // reject //evil.com, /\evil.com
  if (/[\x00-\x1f]/.test(path)) return false; // reject control chars
  return true;
}
