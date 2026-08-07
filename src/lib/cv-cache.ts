// Client-side cache for viewing saved CVs.
// Goal: after the first view, re-opening the same CV shows instantly from cache
// while quietly refreshing from the server in the background (stale-while-revalidate).
// Cache lives in localStorage, scoped per user, expires after TTL.

const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_ENTRIES = 30;

export const getCvCacheKey = (userId: string, cvId: string) => `cv-cache-${userId}-${cvId}`;

interface CachedCv {
  data: Record<string, unknown>;
  savedAt: number;
}

export function getCachedCv(userId: string, cvId: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(getCvCacheKey(userId, cvId));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedCv;
    if (Date.now() - entry.savedAt > TTL_MS) {
      localStorage.removeItem(getCvCacheKey(userId, cvId));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedCv(userId: string, cvId: string, data: Record<string, unknown>): void {
  try {
    const entry: CachedCv = { data, savedAt: Date.now() };
    localStorage.setItem(getCvCacheKey(userId, cvId), JSON.stringify(entry));
    // Trim oldest entries to avoid unbounded growth.
    const prefix = `cv-cache-${userId}-`;
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
    if (keys.length > MAX_ENTRIES) {
      const stale = keys
        .map((k) => {
          try {
            const e = JSON.parse(localStorage.getItem(k) || "") as CachedCv;
            return { k, t: e.savedAt || 0 };
          } catch {
            return { k, t: 0 };
          }
        })
        .sort((a, b) => a.t - b.t);
      for (const s of stale.slice(0, keys.length - MAX_ENTRIES)) {
        localStorage.removeItem(s.k);
      }
    }
  } catch {
    // ignore storage errors (quota/private mode)
  }
}

export function clearCvCache(userId: string, cvId: string): void {
  try {
    localStorage.removeItem(getCvCacheKey(userId, cvId));
  } catch {
    // ignore
  }
}