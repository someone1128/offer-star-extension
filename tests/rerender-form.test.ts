/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("框架重渲染表单", () => {
  it("前一个字段触发节点替换后仍能填写后续字段", async () => {
    document.body.innerHTML = `
      <div id="form"><label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label></div>
    `;
    const form = document.querySelector("#form")!;
    let replaced = false;
    form.querySelector<HTMLInputElement>('input[name="name"]')!.addEventListener("input", () => {
      if (replaced) return;
      replaced = true;
      form.innerHTML = `<label>姓名<input name="name" value="张三" /></label><label>邮箱<input name="email" /></label>`;
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ name: "张三", email: "zhangsan@example.com" }, "overwrite");
    expect(result.filled).toEqual(["name", "email"]);
    expect(document.querySelector<HTMLInputElement>('input[name="email"]')?.value).toBe("zhangsan@example.com");
  });
});
