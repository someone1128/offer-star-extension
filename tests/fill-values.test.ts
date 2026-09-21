import { describe, expect, it } from "vitest";
import { buildResumeFieldValues } from "../src/shared/fill-values";

describe("最终填写值合并", () => {
  it("默认使用简历值，用户确认的 AI 草稿覆盖对应字段", () => {
    const values = buildResumeFieldValues({
      basic: { name: "张三", phone: "", email: "", currentCity: "北京", gender: "男", targetSalary: "15K" },
      education: [],
      workExperience: [],
      skills: ["TypeScript", "React"],
      projectExperience: [{ name: "招聘助手", role: "产品负责人", startTime: "2024-01", endTime: "2024-06", description: "设计自动填表流程" }],
      selfIntroduction: "原始自我介绍"
    }, { description: "用户修改后的求职动机" });
    expect(values.name).toBe("张三");
    expect(values.city).toBe("北京");
    expect(values.description).toBe("用户修改后的求职动机");
    expect(values.gender).toBe("男");
    expect(values.targetSalary).toBe("15K");
    expect(values.skills).toBe("TypeScript、React");
    expect(values.projectName).toBe("招聘助手");
    expect(values.projectRole).toBe("产品负责人");
    expect(values.projectStartDate).toBe("2024-01");
    expect(values.projectEndDate).toBe("2024-06");
    expect(values.projectDescription).toBe("设计自动填表流程");
  });
});
