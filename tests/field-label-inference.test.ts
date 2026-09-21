/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("非标准表单标题识别", () => {
  it("可以从邻近标题、fieldset legend 和 data-label 推断字段", () => {
    document.body.innerHTML = `
      <div>期望薪资</div><input id="salary" />
      <fieldset><legend>毕业院校</legend><input id="school" /></fieldset>
      <input id="phone" data-label="联系电话" />
    `;
    const fields = createDomEngine(document, "https://example.com/apply").scan();
    expect(fields.map((field) => field.key)).toEqual(["targetSalary", "school", "phone"]);
  });

  it("不会把包含控件的上一个容器当成字段标题", () => {
    document.body.innerHTML = '<div><label>姓名</label><input id="name" /></div><input id="unknown" />';
    const fields = createDomEngine(document, "https://example.com/apply").scan();
    expect(fields[0]?.key).toBe("name");
    expect(fields[1]?.key).toBeNull();
  });
});
