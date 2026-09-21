import type { AiAnalysisResult, DetectedField, FieldKey, FieldValue } from "./messages";
import { isSensitiveFieldLabel } from "./field-matching";

/** 只应用模型返回的字段映射，不直接写入页面；写入仍需经过用户确认。 */
export function applyAiMappings(fields: DetectedField[], result: AiAnalysisResult): DetectedField[] {
  return fields.map((field) => {
    const mapping = result.mappings.find((item) => item.fieldId === field.id);
    return mapping ? { ...field, key: mapping.key, confidence: mapping.confidence } : field;
  });
}

/** 只允许达到置信度门槛的字段进入自动填写；低置信度字段必须由用户手动确认。 */
export function filterValuesByConfidence(values: Record<string, FieldValue>, fields: DetectedField[], minimum = 0.7) {
  const allowed = new Set<string>();
  for (const field of fields) {
    if (field.key && field.confidence >= minimum && !isSensitiveFieldLabel(field.label)) allowed.add(field.key);
  }
  return Object.fromEntries(Object.entries(values).filter(([key]) => {
    const sameKeyFields = fields.filter((field) => field.key === key);
    return sameKeyFields.length > 0 && sameKeyFields.every((field) => field.confidence >= minimum && !isSensitiveFieldLabel(field.label)) && allowed.has(key);
  })) as Record<string, FieldValue>;
}

/** 用户在网页内悬浮面板中确认字段含义后，将该字段提升为可填写状态。 */
export function applyManualFieldConfirmation(fields: DetectedField[], fieldId: string, key: FieldKey | null) {
  return fields.map((field) => field.id === fieldId
    ? { ...field, key, confidence: key ? 1 : 0 }
    : field);
}
