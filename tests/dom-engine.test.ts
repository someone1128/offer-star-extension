/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("页面 DOM 填写引擎", () => {
  it("扫描 BOSS 风格控件并执行增量填写、覆盖填写和撤销", async () => {
    document.body.innerHTML = `
      <div><span id="name-label">姓名</span><input aria-labelledby="name-label" name="name" value="已有姓名" /></div>
      <div><span id="position-label">期望职位</span><button role="combobox" aria-labelledby="position-label" aria-haspopup="listbox">请选择职位</button></div>
      <div role="option" data-value="产品经理" hidden>产品经理</div>
      <div role="option" data-value="运营经理" hidden>运营经理</div>
      <input id="photo" type="file" accept="image/*" />
      <fieldset><legend>学历</legend>
        <label>本科<input type="radio" name="degree" value="本科" /></label>
        <label>硕士<input type="radio" name="degree" value="硕士" /></label>
      </fieldset>
      <label>所在城市<select id="cities" multiple><option>北京</option><option>上海</option><option>广州</option></select></label>
    `;
    const combo = document.querySelector<HTMLElement>("[role=combobox]")!;
    const options = Array.from(document.querySelectorAll<HTMLElement>("[role=option]"));
    combo.addEventListener("click", () => options.forEach((option) => { option.hidden = false; }));
    options.forEach((option) => option.addEventListener("click", () => { combo.textContent = option.textContent; combo.dataset.value = option.dataset.value; }));

    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const fields = engine.scan();
    expect(fields.map((field) => field.key)).toEqual(["name", "targetPosition", "photo", "degree", "degree", "city"]);

    const incremental = await engine.fill({ name: "新姓名", targetPosition: "产品经理" }, "incremental");
    expect(incremental.filled).toEqual(["targetPosition"]);
    expect((document.querySelector("input") as HTMLInputElement).value).toBe("已有姓名");
    expect(combo.dataset.value).toBe("产品经理");

    const overwrite = await engine.fill({ name: "新姓名", targetPosition: "运营经理" }, "overwrite");
    expect(overwrite.filled).toEqual(["name", "targetPosition"]);
    expect((document.querySelector("input") as HTMLInputElement).value).toBe("新姓名");

    const undone = await engine.undo();
    expect(undone.restored).toHaveLength(2);
    expect((document.querySelector("input") as HTMLInputElement).value).toBe("已有姓名");

    const photo = await engine.fillPhoto("data:image/png;base64,AA==", "证件照.png", "image/png");
    expect(photo.filled).toBe(true);
    expect((document.querySelector("#photo") as HTMLInputElement).files?.[0]?.name).toBe("证件照.png");

    const degreeFill = await engine.fill({ degree: "硕士" }, "overwrite");
    expect(degreeFill.filled).toEqual(["degree"]);
    expect((document.querySelector('input[value="硕士"]') as HTMLInputElement).checked).toBe(true);
    await engine.undo();
    expect((document.querySelector('input[value="硕士"]') as HTMLInputElement).checked).toBe(false);

    const cities = await engine.fill({ city: "北京，上海" }, "overwrite");
    expect(cities.filled).toEqual(["city"]);
    expect(Array.from(document.querySelectorAll("#cities option")).filter((option) => (option as HTMLOptionElement).selected).map((option) => option.textContent)).toEqual(["北京", "上海"]);
  });

  it("识别到控件但候选项不匹配时返回失败字段", async () => {
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ city: "不存在的城市" }, "overwrite");
    expect(result.filled).toEqual([]);
    expect(result.failed).toEqual(["city"]);
    expect(result.failureReasons).toEqual({ city: "控件不支持该值或候选项未匹配" });
  });
});
