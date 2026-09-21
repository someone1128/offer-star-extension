import type { DetectedField, FieldValue } from "./messages";

export type FillPreviewItem = {
  fieldId: string;
  label: string;
  key: string;
  value: string;
};

/** 生成填写前的本地预览；只展示达到置信度门槛且确实有值的字段。 */
export function buildFillPreview(fields: DetectedField[], values: Record<string, FieldValue>, minimum = 0.7): FillPreviewItem[] {
  const keyOccurrences = new Map<string, number>();
  const result: FillPreviewItem[] = [];
  for (const field of fields) {
    if (!field.key || field.key === "photo" || field.key === "attachment" || field.confidence < minimum) continue;
    const raw = values[field.key];
    if (raw === undefined) continue;
    const occurrence = keyOccurrences.get(field.key) ?? 0;
    keyOccurrences.set(field.key, occurrence + 1);
    const value = Array.isArray(raw) ? String(raw[occurrence] ?? "") : String(raw);
    if (!value.trim()) continue;
    result.push({ fieldId: field.id, label: field.label || "未命名字段", key: field.key, value });
  }
  return result;
}
