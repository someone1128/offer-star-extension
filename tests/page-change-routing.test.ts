import { describe, expect, it } from "vitest";
import { shouldForwardPageChange } from "../src/shared/page-change-routing";

describe("页面变化消息路由", () => {
  it("内容脚本带有效标签页编号时允许转发", () => {
    expect(shouldForwardPageChange(12)).toBe(true);
  });

  it("后台或悬浮面板消息没有标签页编号时禁止转发", () => {
    expect(shouldForwardPageChange(undefined)).toBe(false);
  });

  it("零值、负数和小数标签页编号都禁止转发", () => {
    expect(shouldForwardPageChange(0)).toBe(false);
    expect(shouldForwardPageChange(-1)).toBe(false);
    expect(shouldForwardPageChange(1.5)).toBe(false);
  });
});
