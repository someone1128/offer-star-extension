/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("滚动懒加载表单", () => {
  it("深度扫描会触发滚动加载并发现后续字段", async () => {
    document.body.innerHTML = `<label>姓名<input name="name" /></label>`;
    const win = document.defaultView!;
    Object.defineProperty(win, "scrollTo", { configurable: true, value: () => undefined });
    let loaded = false;
    const onScroll = () => {
      if (loaded) return;
      loaded = true;
      const label = document.createElement("label");
      label.textContent = "邮箱";
      const input = document.createElement("input");
      input.name = "email";
      label.append(input);
      document.body.append(label);
    };
    win.addEventListener("scroll", onScroll);
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const fields = await engine.scanDeep();
    expect(fields.map((field) => field.key)).toEqual(["name", "email"]);
    win.removeEventListener("scroll", onScroll);
  });

  it("没有新增字段时有限次数后结束", async () => {
    document.body.innerHTML = `<label>姓名<input name="name" /></label>`;
    Object.defineProperty(document.defaultView!, "scrollTo", { configurable: true, value: () => undefined });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const fields = await engine.scanDeep();
    expect(fields).toHaveLength(1);
  });
});
