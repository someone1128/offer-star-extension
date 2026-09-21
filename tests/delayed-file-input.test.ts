/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("延迟出现的附件控件", () => {
  it("只点击明确标记的展开按钮，再填写异步出现的文件控件", async () => {
    document.body.innerHTML = `<button type="button" data-upload-reveal>展开上传附件</button>`;
    document.querySelector("button")?.addEventListener("click", () => {
      window.setTimeout(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf";
        document.body.append(input);
      }, 200);
    });
    const result = await createDomEngine(document, "https://app.mokahr.com/apply/example/1").fillFiles([{
      dataUrl: "data:application/pdf;base64,JVBERg==",
      fileName: "简历.pdf",
      mimeType: "application/pdf"
    }]);
    expect(result).toMatchObject({ filled: true, count: 1, failed: [] });
    expect(document.querySelector<HTMLInputElement>("input[type=file]")?.files?.[0]?.name).toBe("简历.pdf");
  });

  it("不会点击没有明确标记的普通按钮", async () => {
    let clicked = false;
    document.body.innerHTML = `<button type="button">上传附件</button>`;
    document.querySelector("button")?.addEventListener("click", () => { clicked = true; });
    const result = await createDomEngine(document, "https://www.zhipin.com/apply/1").fillFiles([{
      dataUrl: "data:application/pdf;base64,JVBERg==",
      fileName: "简历.pdf",
      mimeType: "application/pdf"
    }]);
    expect(result).toMatchObject({ filled: false, count: 0, failed: [] });
    expect(clicked).toBe(false);
  });
});
