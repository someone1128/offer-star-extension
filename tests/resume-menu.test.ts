import { describe, expect, it } from "vitest";
import { nextResumeIndex } from "../src/shared/resume-menu";

describe("简历菜单键盘导航", () => {
  it("在列表首尾循环移动", () => {
    expect(nextResumeIndex(0, "previous", 3)).toBe(2);
    expect(nextResumeIndex(2, "next", 3)).toBe(0);
  });

  it("空列表返回不可选索引，非法索引从第一项开始", () => {
    expect(nextResumeIndex(0, "next", 0)).toBe(-1);
    expect(nextResumeIndex(99, "next", 2)).toBe(1);
  });
});
