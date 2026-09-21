/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("异步原生下拉框", () => {
  it("option 延迟插入后仍能完成填写", async () => {
    document.body.innerHTML = '<label>期望城市<select name="city"><option value="">请选择</option></select></label>';
    const select = document.querySelector("select")!;
    setTimeout(() => select.insertAdjacentHTML("beforeend", '<option value="bj">北京</option>'), 5);

    const engine = createDomEngine(document, "https://example.com/apply");
    const result = await engine.fill({ targetCity: "北京" }, "overwrite");
    expect(result.failed).toEqual([]);
    expect((select as HTMLSelectElement).value).toBe("bj");
  });

  it("候选项始终不存在时有限等待后返回可定位原因", async () => {
    document.body.innerHTML = '<label>期望城市<select name="city"><option value="">请选择</option></select></label>';
    const engine = createDomEngine(document, "https://example.com/apply");
    const result = await engine.fill({ targetCity: "不存在" }, "overwrite");
    expect(result.failed).toEqual(["targetCity"]);
    expect(result.failureReasons.targetCity).toBe("控件不支持该值或候选项未匹配");
  });
});
