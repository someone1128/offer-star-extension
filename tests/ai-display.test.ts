import { describe, expect, it } from "vitest";
import { aiConfidenceLevel, formatAiConfidence } from "../src/shared/ai-display";

describe("AI 映射展示", () => {
  it("把置信度限制在 0 到 100%", () => {
    expect(formatAiConfidence(0.86)).toBe("86%");
    expect(formatAiConfidence(2)).toBe("100%");
    expect(formatAiConfidence(-1)).toBe("0%");
  });

  it("按阈值区分高、中、低置信度", () => {
    expect(aiConfidenceLevel(0.9)).toBe("high");
    expect(aiConfidenceLevel(0.75)).toBe("medium");
    expect(aiConfidenceLevel(0.4)).toBe("low");
  });
});
