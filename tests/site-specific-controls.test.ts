/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("站点特有控件夹具", () => {
  it("BOSS 直聘可搜索职位下拉框输入后选择候选项", async () => {
    document.body.innerHTML = `
      <input role="combobox" aria-label="期望职位" aria-haspopup="listbox" />
      <div role="option" data-value="产品经理" hidden>产品经理</div>
    `;
    const input = document.querySelector<HTMLInputElement>("input")!;
    const option = document.querySelector<HTMLElement>("[role=option]")!;
    input.addEventListener("input", () => { option.hidden = false; });
    option.addEventListener("click", () => { input.dataset.value = option.dataset.value ?? ""; });
    const engine = createDomEngine(document, "https://www.zhipin.com/job_detail/1");
    expect((await engine.fill({ targetPosition: "产品经理" }, "overwrite")).filled).toEqual(["targetPosition"]);
    expect(input.dataset.value).toBe("产品经理");
  });

  it("猎聘富文本工作内容可以填写并触发输入事件", async () => {
    document.body.innerHTML = `<div contenteditable="true" aria-label="工作内容"></div>`;
    const editor = document.querySelector<HTMLElement>("[contenteditable=true]")!;
    let inputEvents = 0;
    editor.addEventListener("input", () => { inputEvents += 1; });
    const engine = createDomEngine(document, "https://www.liepin.com/job/1");
    expect((await engine.fill({ description: "负责产品规划和用户增长" }, "overwrite")).filled).toEqual(["description"]);
    expect(editor.textContent).toBe("负责产品规划和用户增长");
    expect(inputEvents).toBeGreaterThan(0);
  });

  it("前程无忧步骤页可以写入照片并点击继续按钮", async () => {
    document.body.innerHTML = `<input type="file" accept="image/*" aria-label="证件照" /><button type="button">保存并继续</button>`;
    const engine = createDomEngine(document, "https://jobs.51job.com/apply/1");
    expect((await engine.fillPhoto("data:image/png;base64,AA==", "avatar.png", "image/png")).filled).toBe(true);
    expect((await engine.advanceStep()).advanced).toBe(true);
  });

  it("校园招聘附件控件会进入待确认字段", () => {
    document.body.innerHTML = `<label>上传简历附件<input type="file" /></label>`;
    const fields = createDomEngine(document, "https://campus.zhipin.com/apply/1").scan();
    expect(fields[0]?.key).toBe("attachment");
  });
});
