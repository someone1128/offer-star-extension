import type { ResumeProfile, ResumeSummary } from "./messages";

type LooseRecord = Record<string, unknown>;

/** 将 Offer Star 现有简历模块结构转换成扩展统一填写模型。 */
export function normalizeResumeProfile(payload: unknown): ResumeProfile {
  const root = asRecord(payload);
  const modules = Array.isArray(root.resumeModules) ? root.resumeModules : [];
  const moduleMap = new Map<string, unknown>();
  for (const item of modules) {
    const module = asRecord(item);
    const type = String(module.moduleType ?? "");
    const content = parseModuleContent(module.moduleContent);
    moduleMap.set(type, content);
  }

  const basic = asRecord(moduleMap.get("个人信息") ?? moduleMap.get("基本信息"));
  const education = asArray(moduleMap.get("教育经历") ?? moduleMap.get("教育背景"));
  const workExperience = asArray(moduleMap.get("工作经历") ?? moduleMap.get("工作经验"));
  const projectExperience = asArray(moduleMap.get("项目经历") ?? moduleMap.get("项目经验"));
  const skillModule = asRecord(moduleMap.get("其他能力") ?? moduleMap.get("技能/证书/语言/兴趣爱好"));
  const advantageModule = asRecord(moduleMap.get("个人优势") ?? moduleMap.get("个人总结") ?? moduleMap.get("自我评价"));

  return {
    basic: {
      name: stringValue(basic.name),
      phone: stringValue(basic.phone),
      email: stringValue(basic.email),
      age: stringValue(basic.age),
      gender: stringValue(basic.gender),
      currentCity: stringValue(basic.currentCity ?? basic.targetCity),
      targetCity: stringValue(basic.targetCity),
      currentStatus: stringValue(basic.currentStatus),
      targetSalary: stringValue(basic.targetSalary),
      wechat: stringValue(basic.wechat),
      website: stringValue(basic.website),
      github: stringValue(basic.github),
      targetPosition: stringValue(basic.targetPosition)
    },
    education: education.map((item) => ({
      school: stringValue(item.school),
      major: stringValue(item.profession ?? item.major),
      degree: stringValue(item.degree)
    })),
    workExperience: workExperience.map((item) => ({
      company: stringValue(item.company),
      position: stringValue(item.position),
      description: stringValue(item.description),
      startTime: stringValue(item.startTime ?? item.startDate),
      endTime: stringValue(item.endTime ?? item.endDate)
    })),
    projectExperience: projectExperience.map((item) => ({
      name: stringValue(item.name ?? item.projectName),
      role: stringValue(item.role),
      description: stringValue(item.description),
      startTime: stringValue(item.startTime ?? item.startDate),
      endTime: stringValue(item.endTime ?? item.endDate)
    })),
    skills: skillModule ? [
      ...asStringArray(skillModule.skills ?? skillModule.description),
      ...asStringArray(skillModule.technology)
    ].filter(Boolean) : [],
    selfIntroduction: stringValue(advantageModule?.description)
  };
}

/** 将简历列表接口的分页结果转换成扩展需要的最小字段。 */
export function normalizeResumeList(payload: unknown): ResumeSummary[] {
  const root = asRecord(payload);
  const list = Array.isArray(root.list) ? root.list : Array.isArray(payload) ? payload : [];
  return list.map((item) => {
    const record = asRecord(item);
    return {
      id: String(record.id ?? ""),
      title: stringValue(record.title) || "未命名简历",
      previewImage: stringValue(record.previewImage),
      updateTime: stringValue(record.updateTime)
    };
  }).filter((item) => item.id);
}

function parseModuleContent(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    console.warn("[Offer Star][Resume] 简历模块内容不是有效 JSON");
    return {};
  }
}

function asRecord(value: unknown): LooseRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as LooseRecord : {};
}

function asArray(value: unknown): LooseRecord[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function stringValue(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(stringValue).filter(Boolean);
  const result = stringValue(value);
  return result ? [result] : [];
}
