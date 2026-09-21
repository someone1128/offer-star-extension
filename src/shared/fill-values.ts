import type { FieldValue, ResumeProfile } from "./messages";

/** 将简历基础数据和用户确认后的 AI 草稿合并为最终填写值。 */
export function buildResumeFieldValues(resume: ResumeProfile, overrides: Record<string, string> = {}): Record<string, FieldValue> {
  const work = resume.workExperience;
  const education = resume.education;
  const projects = resume.projectExperience ?? [];
  const repeated = (items: string[]) => items.length > 1 ? items : (items[0] ?? "");
  const values: Record<string, FieldValue> = {
    name: resume.basic.name,
    phone: resume.basic.phone,
    email: resume.basic.email,
    city: resume.basic.currentCity ?? "",
    targetCity: resume.basic.targetCity ?? "",
    age: resume.basic.age ?? "",
    gender: resume.basic.gender ?? "",
    currentStatus: resume.basic.currentStatus ?? "",
    targetSalary: resume.basic.targetSalary ?? "",
    wechat: resume.basic.wechat ?? "",
    website: resume.basic.website ?? "",
    github: resume.basic.github ?? "",
    targetPosition: resume.basic.targetPosition ?? "",
    school: repeated(education.map((item) => item.school)),
    major: repeated(education.map((item) => item.major ?? "")),
    degree: repeated(education.map((item) => item.degree ?? "")),
    company: repeated(work.map((item) => item.company)),
    position: repeated(work.map((item) => item.position ?? "")),
    startDate: repeated(work.map((item) => item.startTime ?? "")),
    endDate: repeated(work.map((item) => item.endTime ?? "")),
    description: repeated(work.map((item) => item.description ?? resume.selfIntroduction ?? "")),
    skills: resume.skills.join("、"),
    projectName: repeated(projects.map((item) => item.name)),
    projectRole: repeated(projects.map((item) => item.role ?? "")),
    projectStartDate: repeated(projects.map((item) => item.startTime ?? "")),
    projectEndDate: repeated(projects.map((item) => item.endTime ?? "")),
    projectDescription: repeated(projects.map((item) => item.description ?? ""))
  };
  return { ...values, ...overrides };
}
