import { describe, expect, it } from "vitest";
import { getStalePageMessage } from "../src/panel/page-guards";

describe("Side Panel 页面过期守卫", () => {
  it("页面未变化时允许继续操作", () => {
    expect(getStalePageMessage(false, "填写")).toBeNull();
  });

  it("页面变化后阻断填写", () => {
    expect(getStalePageMessage(true, "填写")).toContain("不能填写");
  });

  it.each([["撤销"], ["确认附件"], ["点击下一步"]])("页面变化后阻断%s", (action) => {
    expect(getStalePageMessage(true, action)).toContain(`不能${action}`);
  });
});
