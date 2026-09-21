/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("Shadow DOM 表单控件", () => {
  it("扫描并填写开放式 Shadow Root 内的字段", async () => {
    const host = document.createElement("resume-field");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `<label>姓名<input name="name" /></label>`;
    document.body.append(host);
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    expect(engine.scan().map((field) => field.key)).toEqual(["name"]);
    const result = await engine.fill({ name: "张三" }, "overwrite");
    expect(result.filled).toEqual(["name"]);
    expect(shadow.querySelector<HTMLInputElement>("input")?.value).toBe("张三");
  });

  it("可以点击 Shadow DOM 内的下一步按钮", async () => {
    const host = document.createElement("resume-step");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `<button type="button">下一步</button>`;
    document.body.append(host);
    const button = shadow.querySelector("button")!;
    let clicked = false;
    button.addEventListener("click", () => { clicked = true; });
    const engine = createDomEngine(document, "https://www.zhaopin.com/apply/1");
    expect(await engine.advanceStep()).toEqual({ advanced: true, label: "下一步" });
    expect(clicked).toBe(true);
  });
});
