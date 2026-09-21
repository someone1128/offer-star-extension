import type { FieldKey, FieldValue } from "./messages";

/** 对容易造成明显误填的字段做轻量格式校验；业务字段仍允许自然语言。 */
export function validateFieldValue(key: string, value: FieldValue): string | null {
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    const text = String(item).trim();
    if (!text) continue;
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "邮箱格式不合法";
    if (key === "phone" && !/^(?:\+?86[-\s]?)?(?:1\d{10}|0\d{2,3}[-\s]?\d{7,8})$/.test(text)) return "手机号或电话格式不合法";
    if (key === "age" && !/^(?:1[4-9]|[2-9]\d|100)$/.test(text)) return "年龄应为 14 到 100 的整数";
    if ((key as FieldKey).endsWith("Date") && !/^(?:至今|在职|present|\d{4}(?:年\d{1,2}月?(?:\d{1,2}日?)?|[-/.]\d{1,2}(?:[-/.]\d{1,2})?))$/i.test(text)) return "日期格式不合法";
  }
  return null;
}
