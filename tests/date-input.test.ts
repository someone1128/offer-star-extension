/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("日期字段填写", () => {
  it("把中文日期转换为 date 和 month 控件格式", async () => {
    document.body.innerHTML = `
      <label>入职日期<input id="start" type="date" /></label>
      <label>离职日期<input id="end" type="month" /></label>
    `;
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ startDate: "2022年3月5日", endDate: "2024.06" }, "overwrite");
    expect(result.filled).toEqual(["startDate", "endDate"]);
    expect((document.querySelector("#start") as HTMLInputElement).value).toBe("2022-03-05");
    expect((document.querySelector("#end") as HTMLInputElement).value).toBe("2024-06");
  });

  it("选择自定义日期下拉框中的中文日期选项", async () => {
    document.body.innerHTML = `
      <button role="combobox" aria-label="入职日期" aria-haspopup="listbox">请选择日期</button>
      <div role="option" data-value="2022-03-05" hidden>2022年3月5日</div>
    `;
    const combo = document.querySelector<HTMLElement>("[role=combobox]")!;
    const option = document.querySelector<HTMLElement>("[role=option]")!;
    combo.addEventListener("click", () => { option.hidden = false; });
    option.addEventListener("click", () => { combo.textContent = option.textContent; combo.dataset.value = option.dataset.value ?? ""; });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ startDate: "2022-03-05" }, "overwrite");
    expect(result.filled).toEqual(["startDate"]);
    expect(combo.dataset.value).toBe("2022-03-05");
  });
});
