import type { ResumeSummary } from "./messages";

export type FillMode = "incremental" | "overwrite";

/** 从当前账号的简历列表中选择上次使用的简历，不存在时回退到第一份。 */
export function resolvePreferredResumeId(resumes: ResumeSummary[], savedId?: string) {
  return resumes.find((resume) => resume.id === savedId)?.id ?? resumes[0]?.id ?? "";
}

export function normalizeFillMode(value: unknown): FillMode {
  return value === "overwrite" ? "overwrite" : "incremental";
}
