/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("分步骤网申导航", () => {
  it("点击下一步并允许页面展示下一步骤字段", async () => {
    document.body.innerHTML = `
      <section id="step-one"><label>姓名<input name="name" /></label><button type="button" id="next">下一步</button></section>
      <section id="step-two" hidden><label>邮箱<input name="email" /></label></section>
    `;
    document.querySelector("#next")?.addEventListener("click", () => {
      document.querySelector("#step-one")?.setAttribute("hidden", "true");
      document.querySelector("#step-two")?.removeAttribute("hidden");
    });
    const engine = createDomEngine(document, "https://www.zhaopin.com/apply/1");
    const result = await engine.advanceStep();
    expect(result).toEqual({ advanced: true, label: "下一步" });
    expect(document.querySelector("#step-two")?.hasAttribute("hidden")).toBe(false);
    expect(engine.scan().some((field) => field.key === "email")).toBe(true);
  });

  it("不会点击提交或投递按钮", async () => {
    document.body.innerHTML = `<button type="button">立即申请</button><button type="button">提交</button>`;
    const engine = createDomEngine(document, "https://www.zhaopin.com/apply/1");
    expect(await engine.advanceStep()).toEqual({ advanced: false });
  });

  it("忽略隐藏和禁用的下一步按钮", async () => {
    document.body.innerHTML = `<button type="button" hidden>下一步</button><button type="button" disabled>继续</button>`;
    const engine = createDomEngine(document, "https://www.zhaopin.com/apply/1");
    expect(await engine.advanceStep()).toEqual({ advanced: false });
  });
});
