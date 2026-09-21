/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";

describe("动态经历区块", () => {
  it("需要多段经历时点击新增工作经历并继续填写", async () => {
    document.body.innerHTML = `
      <section id="experiences">
        <label>公司<input name="company-1" /></label>
        <button type="button" id="add">新增工作经历</button>
      </section>
    `;
    document.querySelector("#add")?.addEventListener("click", () => {
      const section = document.querySelector("#experiences")!;
      const wrapper = document.createElement("label");
      wrapper.textContent = "公司";
      const input = document.createElement("input");
      input.name = "company-2";
      wrapper.append(input);
      section.insertBefore(wrapper, document.querySelector("#add"));
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ company: ["甲公司", "乙公司"] }, "overwrite");
    expect(result.filled).toEqual(["company", "company"]);
    expect(Array.from(document.querySelectorAll<HTMLInputElement>("input")).map((input) => input.value)).toEqual(["甲公司", "乙公司"]);
  });

  it("不会因为新增按钮没有产生区块而无限点击", async () => {
    document.body.innerHTML = `<label>公司<input name="company-1" /></label><button type="button">新增工作经历</button>`;
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ company: ["甲公司", "乙公司", "丙公司"] }, "overwrite");
    expect(result.filled).toEqual(["company"]);
  });

  it("需要多个项目经历时点击新增项目经历并按顺序填写", async () => {
    document.body.innerHTML = `
      <section id="projects">
        <label>项目名称<input name="projectName-1" /></label>
        <button type="button" id="add-project">新增项目经历</button>
      </section>
    `;
    document.querySelector<HTMLButtonElement>("#add-project")?.addEventListener("click", () => {
      const section = document.querySelector("#projects")!;
      const wrapper = document.createElement("label");
      wrapper.textContent = "项目名称";
      const input = document.createElement("input");
      input.name = "projectName-2";
      wrapper.append(input);
      section.insertBefore(wrapper, document.querySelector("#add-project"));
    });
    const engine = createDomEngine(document, "https://www.zhipin.com/job/1");
    const result = await engine.fill({ projectName: ["招聘助手", "自动投递"] }, "overwrite");
    expect(result.filled).toEqual(["projectName", "projectName"]);
    expect(Array.from(document.querySelectorAll<HTMLInputElement>("input")).map((input) => input.value)).toEqual(["招聘助手", "自动投递"]);
  });
});
