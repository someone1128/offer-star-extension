/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("ARIA 自定义表单控件", () => {
  it("可以填写 role=checkbox 的普通自定义复选框", async () => {
    document.body.innerHTML = `<div><span>求职状态</span><div role="checkbox" aria-label="求职状态" aria-checked="false"></div></div>`;
    const checkbox = document.querySelector<HTMLElement>('[role="checkbox"]')!;
    checkbox.addEventListener("click", () => checkbox.setAttribute("aria-checked", "true"));
    const engine = createDomEngine(document, "https://example.com/apply");
    const fields = engine.scan();
    expect(fields.some((field) => field.label.includes("求职状态"))).toBe(true);
    const result = await engine.fill({ currentStatus: "是" }, "overwrite");
    expect(result.failed).toEqual([]);
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
  });

  it("不会自动勾选 role=checkbox 的协议授权控件", async () => {
    document.body.innerHTML = `<div role="checkbox" aria-label="邮箱隐私协议" aria-checked="false"></div>`;
    const engine = createDomEngine(document, "https://example.com/apply");
    const result = await engine.fill({ email: "privacy@example.com" }, "overwrite");
    expect(result.filled).toEqual([]);
    expect(result.failed).toEqual(["email"]);
    expect(result.failureReasons).toEqual({ email: "控件不支持该值或候选项未匹配" });
    expect(document.querySelector<HTMLElement>('[role="checkbox"]')?.getAttribute("aria-checked")).toBe("false");
  });

  it("可以按可见文案选择 role=radio 的自定义单选项", async () => {
    document.body.innerHTML = `<div role="radiogroup" aria-label="性别"><div role="radio" aria-label="男" aria-checked="false"></div><div role="radio" aria-label="女" aria-checked="false"></div></div>`;
    const options = Array.from(document.querySelectorAll<HTMLElement>('[role="radio"]'));
    options.forEach((option) => option.addEventListener("click", () => {
      options.forEach((item) => item.setAttribute("aria-checked", String(item === option)));
    }));
    const engine = createDomEngine(document, "https://example.com/apply");
    const result = await engine.fill({ gender: "女" }, "overwrite");
    expect(result.failed).toEqual([]);
    expect(options[0].getAttribute("aria-checked")).toBe("false");
    expect(options[1].getAttribute("aria-checked")).toBe("true");
  });
});
