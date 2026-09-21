/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("虚拟列表滚动选择", () => {
  it("滚动 listbox 后节点被回收并出现目标候选项", async () => {
    document.body.innerHTML = `
      <input role="combobox" aria-label="期望职位" aria-haspopup="listbox" />
      <div role="listbox" id="jobs"><div role="option" data-value="职位1">职位1</div></div>
    `;
    const input = document.querySelector<HTMLInputElement>("input")!;
    const listbox = document.querySelector<HTMLElement>("#jobs")!;
    Object.defineProperty(listbox, "clientHeight", { configurable: true, value: 100 });
    Object.defineProperty(listbox, "scrollHeight", { configurable: true, value: 1000 });
    listbox.addEventListener("scroll", () => {
      listbox.innerHTML = `<div role="option" data-value="高级数据分析师">高级数据分析师</div>`;
    });
    const target = "高级数据分析师";
    listbox.addEventListener("click", (event) => {
      const clicked = (event.target as HTMLElement).closest<HTMLElement>("[role=option]");
      if (clicked) input.dataset.value = clicked.dataset.value ?? "";
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ targetPosition: target }, "overwrite");
    expect(result.filled).toEqual(["targetPosition"]);
    expect(input.dataset.value).toBe(target);
  });
});
