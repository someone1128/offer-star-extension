/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("异步虚拟下拉列表", () => {
  it("候选项延迟插入时仍能完成选择", async () => {
    document.body.innerHTML = `<input role="combobox" aria-label="期望职位" aria-haspopup="listbox" />`;
    const input = document.querySelector<HTMLInputElement>("input")!;
    let scheduled = false;
    input.addEventListener("input", () => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        const option = document.createElement("div");
        option.setAttribute("role", "option");
        option.dataset.value = "数据分析师";
        option.textContent = "数据分析师";
        document.body.append(option);
        option.addEventListener("click", () => { input.value = option.textContent ?? ""; input.dataset.value = option.dataset.value ?? ""; });
      }, 30);
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ targetPosition: "数据分析师" }, "overwrite");
    expect(result.filled).toEqual(["targetPosition"]);
    expect(input.dataset.value).toBe("数据分析师");
  });
});
