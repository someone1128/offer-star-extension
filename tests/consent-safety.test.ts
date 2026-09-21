/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("授权类复选框安全边界", () => {
  it("不会自动勾选协议、隐私或营销授权", async () => {
    document.body.innerHTML = `<label>邮箱营销授权及隐私协议<input type="checkbox" name="email" value="true" /></label>`;
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ email: "true" }, "overwrite");
    expect(result.filled).toEqual([]);
    expect((document.querySelector("input") as HTMLInputElement).checked).toBe(false);
  });
});
