import type { DetectedField } from "./messages";
import { isSensitiveFieldLabel } from "./field-matching";

/** 只有所有字段都能安全自动填写时，才允许展示一键填写入口。 */
export function canQuickFill(fields: DetectedField[], pageStale: boolean) {
  if (pageStale || fields.length === 0) return false;
  return fields.every((field) => Boolean(field.key) && field.confidence >= 0.7 && field.key !== "photo" && field.key !== "attachment" && !isSensitiveFieldLabel(field.label));
}
