import { describe, expect, it } from "vitest";
import { clearResumeCacheKeys, isResumeCacheFresh, profileCacheKey, RESUME_LIST_CACHE_KEY } from "../src/shared/resume-cache";

describe("简历短时缓存", () => {
  it("只接受十分钟内的未来有效缓存", () => {
    expect(isResumeCacheFresh({ value: [], savedAt: 9_000 }, 10_000)).toBe(true);
    expect(isResumeCacheFresh({ value: [], savedAt: 0 }, 10 * 60 * 1000 + 1)).toBe(false);
    expect(isResumeCacheFresh({ value: [], savedAt: 11_000 }, 10_000)).toBe(false);
  });

  it("生成隔离的简历详情键并清理所有缓存键", () => {
    const profileKey = profileCacheKey("resume/1");
    expect(profileKey).toBe("resumeCache:profile:resume/1");
    expect(clearResumeCacheKeys([RESUME_LIST_CACHE_KEY, profileKey, "selectedResumeId", "siteMetrics"])).toEqual([RESUME_LIST_CACHE_KEY, profileKey]);
  });
});
