/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

const png = { dataUrl: "data:image/png;base64,AA==", fileName: "证件照.png", mimeType: "image/png" };
const pdf = { dataUrl: "data:application/pdf;base64,JVBERg==", fileName: "作品集.pdf", mimeType: "application/pdf" };
const docx = { dataUrl: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEs=", fileName: "简历.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

describe("附件文件控件", () => {
  it("多文件控件可以一次写入照片和 PDF", async () => {
    document.body.innerHTML = `<input type="file" multiple accept="image/*,.pdf" aria-label="简历附件" />`;
    const input = document.querySelector<HTMLInputElement>("input[type=file]")!;
    const result = await createDomEngine(document, "https://campus.zhipin.com/apply/1").fillFiles([png, pdf]);
    expect(result).toMatchObject({ filled: true, count: 2, failed: [] });
    expect(input.files).toHaveLength(2);
    expect(input.files?.[0]?.name).toBe("证件照.png");
    expect(input.files?.[1]?.name).toBe("作品集.pdf");
  });

  it("单文件控件只写入第一个附件，避免覆盖控件约束", async () => {
    document.body.innerHTML = `<input type="file" accept="application/pdf" aria-label="简历附件" />`;
    const input = document.querySelector<HTMLInputElement>("input[type=file]")!;
    const result = await createDomEngine(document, "https://www.zhaopin.com/apply/1").fillFiles([pdf, png]);
    expect(result).toMatchObject({ filled: true, count: 1 });
    expect(input.files).toHaveLength(1);
    expect(input.files?.[0]?.name).toBe("作品集.pdf");
  });

  it("多个单文件控件按顺序分配附件", async () => {
    document.body.innerHTML = `<input type="file" accept="image/*" /><input type="file" accept=".pdf" />`;
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[type=file]"));
    const result = await createDomEngine(document, "https://www.nowcoder.com/apply/1").fillFiles([png, pdf]);
    expect(result.count).toBe(2);
    expect(inputs[0].files?.[0]?.name).toBe("证件照.png");
    expect(inputs[1].files?.[0]?.name).toBe("作品集.pdf");
  });

  it("根据 accept 属性分配附件，不依赖上传控件和文件选择顺序", async () => {
    document.body.innerHTML = `<input type="file" accept=".pdf" /><input type="file" accept="image/*" />`;
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[type=file]"));
    const result = await createDomEngine(document, "https://beisen.zhiye.com/jobs/1").fillFiles([png, pdf]);
    expect(result).toMatchObject({ filled: true, count: 2, failed: [] });
    expect(inputs[0].files?.[0]?.name).toBe("作品集.pdf");
    expect(inputs[1].files?.[0]?.name).toBe("证件照.png");
  });

  it("照片、简历和作品集三个上传控件可以按类型分别写入", async () => {
    document.body.innerHTML = `
      <label>作品集<input type="file" accept="application/pdf" aria-label="作品集" /></label>
      <label>证件照<input type="file" accept="image/*" aria-label="证件照" /></label>
      <label>简历<input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-label="简历" /></label>`;
    const result = await createDomEngine(document, "https://app.mokahr.com/apply/example/1").fillFiles([docx, png, pdf]);
    expect(result).toMatchObject({ filled: true, count: 3, failed: [] });
    expect(document.querySelector<HTMLInputElement>("[aria-label='作品集']")?.files?.[0]?.name).toBe("作品集.pdf");
    expect(document.querySelector<HTMLInputElement>("[aria-label='证件照']")?.files?.[0]?.name).toBe("证件照.png");
    expect(document.querySelector<HTMLInputElement>("[aria-label='简历']")?.files?.[0]?.name).toBe("简历.docx");
  });

  it("拒绝不支持的附件类型并返回失败文件名", async () => {
    document.body.innerHTML = `<input type="file" multiple />`;
    const result = await createDomEngine(document, "https://www.lagou.com/apply/1").fillFiles([{ dataUrl: "data:text/plain;base64,QQ==", fileName: "密码.txt", mimeType: "text/plain" }]);
    expect(result).toEqual({ filled: false, count: 0, failed: ["密码.txt"] });
  });
});
