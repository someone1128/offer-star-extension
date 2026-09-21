/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("同源 iframe 网申表单", () => {
  it("可以扫描并填写同源 iframe 内的字段", async () => {
    document.body.innerHTML = "<iframe id=resume-frame></iframe>";
    const frame = document.querySelector("iframe") as HTMLIFrameElement;
    const frameDocument = document.implementation.createHTMLDocument("申请表");
    frameDocument.body.innerHTML = '<label>邮箱<input name="email" /></label><label>姓名<input name="name" /></label>';
    Object.defineProperty(frame, "contentDocument", { configurable: true, value: frameDocument });

    const engine = createDomEngine(document, "https://campus.example.com/apply/1");
    const fields = engine.scan();
    expect(fields.map((field) => field.key)).toEqual(["email", "name"]);
    const result = await engine.fill({ email: "iframe@example.com", name: "测试用户" }, "overwrite");
    expect(result.failed).toEqual([]);
    expect(frameDocument.querySelector<HTMLInputElement>("[name=email]")?.value).toBe("iframe@example.com");
    expect(frameDocument.querySelector<HTMLInputElement>("[name=name]")?.value).toBe("测试用户");
  });

  it("读取跨域 iframe 失败时跳过，不影响主页面字段扫描", () => {
    document.body.innerHTML = '<label>姓名<input name="name" /></label><iframe id="cross-origin"></iframe>';
    const frame = document.querySelector("#cross-origin") as HTMLIFrameElement;
    Object.defineProperty(frame, "contentDocument", { configurable: true, get: () => { throw new DOMException("Blocked", "SecurityError"); } });

    const engine = createDomEngine(document, "https://example.com/apply/1");
    expect(engine.scan().map((field) => field.key)).toEqual(["name"]);
  });
});
