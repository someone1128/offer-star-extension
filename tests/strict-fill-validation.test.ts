/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("严格填写值校验", () => {
  it("拒绝明显非法值且不修改页面控件", async () => {
    document.body.innerHTML = `<label>邮箱<input name="email" value="原邮箱" /></label><label>手机号<input name="phone" value="原电话" /></label><label>年龄<input name="age" value="原年龄" /></label><label>开始日期<input name="startDate" value="原日期" /></label>`;
    const engine = createDomEngine(document, "https://unknown.example/apply");
    const result = await engine.fill({ email: "not-an-email", phone: "123", age: "13", startDate: "日期待定" }, "overwrite");
    expect(result.filled).toEqual([]);
    expect(result.failed).toEqual(["email", "phone", "age", "startDate"]);
    expect(result.failureReasons).toEqual({
      email: "邮箱格式不合法",
      phone: "手机号或电话格式不合法",
      age: "年龄应为 14 到 100 的整数",
      startDate: "日期格式不合法"
    });
    expect(Array.from(document.querySelectorAll<HTMLInputElement>("input")).map((input) => input.value)).toEqual(["原邮箱", "原电话", "原年龄", "原日期"]);
  });
});
