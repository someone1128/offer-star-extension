import type { DetectedField, FieldKey } from "./messages";

export type SiteFieldOverrides = Record<string, Record<string, FieldKey>>;

/** 统一字段标题，作为站点内可复用映射的稳定键。 */
export function normalizeFieldLabel(label: string) {
  return label.trim().toLocaleLowerCase().replace(/[\s:：*（）()【】\[\]_-]+/g, "");
}

/** 应用用户在同一站点确认过的字段映射，不覆盖已有高置信度识别结果。 */
export function applySavedFieldOverrides(fields: DetectedField[], siteId: string, overrides: SiteFieldOverrides) {
  const siteOverrides = overrides[siteId] ?? {};
  return fields.map((field) => {
    if (field.key && field.confidence >= 0.7) return field;
    const key = siteOverrides[normalizeFieldLabel(field.label)];
    return key ? { ...field, key, confidence: 1 } : field;
  });
}

/** 保存一次用户确认，只保留站点、字段标题和字段类型。 */
export function saveFieldOverride(overrides: SiteFieldOverrides, siteId: string, label: string, key: FieldKey | null): SiteFieldOverrides {
  const normalizedLabel = normalizeFieldLabel(label);
  if (!normalizedLabel) return overrides;
  const nextSite = { ...(overrides[siteId] ?? {}) };
  if (key) nextSite[normalizedLabel] = key;
  else delete nextSite[normalizedLabel];
  return { ...overrides, [siteId]: nextSite };
}
