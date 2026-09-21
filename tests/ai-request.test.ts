import { describe, expect, it, vi } from "vitest";
import { requestAiGateway } from "../src/shared/ai-request";

describe("AI 网关请求稳定性", () => {
  it("成功响应时返回结构化 JSON", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{"mappings":[]}', { status: 200 }));
    await expect(requestAiGateway("https://offer.gfjianli.com/api/extension/ai/analyze", "token", {}, { fetchImpl })).resolves.toEqual({ mappings: [] });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("遇到 503 时有限重试并最终成功", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response("暂时不可用", { status: 503 }))
      .mockResolvedValueOnce(new Response('{"mappings":[{"fieldId":"x"}]}', { status: 200 }));
    await expect(requestAiGateway("https://example.test", "token", {}, { fetchImpl, retryDelayMs: 0 })).resolves.toEqual({ mappings: [{ fieldId: "x" }] });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("非重试型 400 立即返回错误", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("bad", { status: 400 }));
    await expect(requestAiGateway("https://example.test", "token", {}, { fetchImpl, retryDelayMs: 0 })).rejects.toThrow("AI 请求失败：400");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("超时重试耗尽后返回可识别错误", async () => {
    const fetchImpl = vi.fn((_url: string, init?: RequestInit) => new Promise<Response>((_, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("超时", "AbortError")));
    }));
    await expect(requestAiGateway("https://example.test", "token", {}, { fetchImpl, timeoutMs: 1, retries: 1, retryDelayMs: 0 })).rejects.toThrow("AI 请求超时");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
