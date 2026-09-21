import { describe, expect, it } from "vitest";
import { normalizeResumeList, normalizeResumeProfile } from "../src/shared/resume-profile";

describe("简历接口数据转换", () => {
  it("可以把 Offer Star 简历模块转换为统一填写模型", () => {
    const profile = normalizeResumeProfile({
      resumeModules: [
        { moduleType: "个人信息", moduleContent: JSON.stringify({ name: "张三", phone: "13800000000", email: "zhang@example.com", gender: "男", age: "28", targetCity: "上海", targetSalary: "20K-30K", targetPosition: "产品经理" }) },
        { moduleType: "教育经历", moduleContent: JSON.stringify([{ school: "测试大学", profession: "计算机科学", degree: "本科" }]) },
        { moduleType: "工作经历", moduleContent: JSON.stringify([{ company: "测试公司", position: "产品助理", description: "负责需求分析" }]) },
        { moduleType: "项目经历", moduleContent: JSON.stringify([{ name: "招聘助手", role: "产品负责人", startTime: "2024-01", endTime: "2024-06", description: "设计自动填表流程" }]) },
        { moduleType: "个人优势", moduleContent: JSON.stringify({ description: "善于跨团队协作" }) }
      ]
    });

    expect(profile.basic.name).toBe("张三");
    expect(profile.education[0]).toEqual({ school: "测试大学", major: "计算机科学", degree: "本科" });
    expect(profile.workExperience[0]?.company).toBe("测试公司");
    expect(profile.basic.gender).toBe("男");
    expect(profile.basic.targetCity).toBe("上海");
    expect(profile.basic.targetSalary).toBe("20K-30K");
    expect(profile.projectExperience?.[0]).toMatchObject({ name: "招聘助手", role: "产品负责人", startTime: "2024-01", endTime: "2024-06" });
    expect(profile.selfIntroduction).toBe("善于跨团队协作");
  });

  it("忽略无效模块并保留可用简历列表", () => {
    expect(normalizeResumeProfile({ resumeModules: [{ moduleType: "教育经历", moduleContent: "坏数据" }] }).basic.name).toBe("");
    expect(normalizeResumeList({ list: [{ id: "r1", title: "校招简历" }, { id: "", title: "无效" }] })).toEqual([
      { id: "r1", title: "校招简历", previewImage: "", updateTime: "" }
    ]);
  });
});
