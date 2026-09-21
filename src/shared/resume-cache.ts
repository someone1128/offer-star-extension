import type { ResumeProfile, ResumeSummary } from "./messages";

export const RESUME_LIST_CACHE_KEY = "resumeCache:list";
export const RESUME_PROFILE_CACHE_PREFIX = "resumeCache:profile:";
export const RESUME_CACHE_TTL_MS = 10 * 60 * 1000;

export type ResumeCacheEntry<T> = { value: T; savedAt: number };

export function profileCacheKey(resumeId: string) {
  return `${RESUME_PROFILE_CACHE_PREFIX}${resumeId}`;
}

export function isResumeCacheFresh<T>(entry: ResumeCacheEntry<T> | undefined, now = Date.now(), ttlMs = RESUME_CACHE_TTL_MS) {
  return Boolean(entry && Number.isFinite(entry.savedAt) && now - entry.savedAt >= 0 && now - entry.savedAt <= ttlMs);
}

export function clearResumeCacheKeys(keys: string[]) {
  return keys.filter((key) => key === RESUME_LIST_CACHE_KEY || key.startsWith(RESUME_PROFILE_CACHE_PREFIX));
}

export type CachedResumeList = ResumeCacheEntry<ResumeSummary[]>;
export type CachedResumeProfile = ResumeCacheEntry<ResumeProfile>;
