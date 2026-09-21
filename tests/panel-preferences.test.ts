import { describe, expect, it } from "vitest";
import { normalizeFillMode, resolvePreferredResumeId } from "../src/shared/panel-preferences";

describe("悬浮面板偏好设置", () => {
  const resumes = [{ id: "r1", title: "简历一" }, { id: "r2", title: "简历二" }];

  it("优先恢复用户上次选择的简历", () => {
    expect(resolvePreferredResumeId(resumes, "r2")).toBe("r2");
    expect(resolvePreferredResumeId(resumes, "已删除")).toBe("r1");
    expect(resolvePreferredResumeId([], "r1")).toBe("");
  });

  it("只接受两个合法填写模式", () => {
    expect(normalizeFillMode("overwrite")).toBe("overwrite");
    expect(normalizeFillMode("unknown")).toBe("incremental");
    expect(normalizeFillMode(undefined)).toBe("incremental");
  });
});
