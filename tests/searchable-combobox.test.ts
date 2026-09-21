/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("可搜索下拉框", () => {
  it("先输入搜索值，再选择动态出现的候选项", async () => {
    document.body.innerHTML = `
      <label>应聘职位<input role="combobox" aria-haspopup="listbox" /></label>
      <div id="options"></div>
    `;
    const input = document.querySelector<HTMLInputElement>("[role=combobox]")!;
    const options = document.querySelector<HTMLElement>("#options")!;
    input.addEventListener("input", () => {
      options.innerHTML = `<div role="option" data-value="产品经理">产品经理</div>`;
      options.firstElementChild?.addEventListener("click", () => { input.dataset.value = "产品经理"; });
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ targetPosition: "产品经理" }, "overwrite");
    expect(result.filled).toEqual(["targetPosition"]);
    expect(input.dataset.value).toBe("产品经理");
  });

  it("不会点击隐藏的同名候选项", async () => {
    document.body.innerHTML = '<label>应聘职位<input role="combobox" aria-haspopup="listbox" /></label><div role="option" data-value="产品经理" hidden>产品经理</div>';
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ targetPosition: "产品经理" }, "overwrite");
    expect(result.failed).toEqual(["targetPosition"]);
    expect(result.failureReasons.targetPosition).toBe("控件不支持该值或候选项未匹配");
  });
});
