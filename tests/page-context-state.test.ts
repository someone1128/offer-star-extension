import { describe, expect, it } from "vitest";
import { getPageContextChangedMessage } from "../src/shared/page-context-state";

describe("页面上下文恢复提示", () => {
  it("有待确认附件时明确要求重新选择，避免跨页面误填", () => {
    expect(getPageContextChangedMessage(true)).toContain("待确认附件需要重新选择");
  });

  it("没有附件时保持普通重新扫描提示", () => {
    expect(getPageContextChangedMessage(false)).toBe("页面已切换，请重新扫描当前申请表单");
  });
});
