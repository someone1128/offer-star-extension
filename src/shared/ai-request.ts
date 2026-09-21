export type AiRequestOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

/**
 * 请求服务端 AI 网关。网络异常、超时和 5xx/429 只做有限重试，避免悬浮面板无限等待。
 * 该函数只返回服务端结构化 JSON，不接收或执行模型返回的代码。
 */
export async function requestAiGateway(url: string, token: string, body: unknown, options: AiRequestOptions = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const retries = options.retries ?? 1;
  const retryDelayMs = options.retryDelayMs ?? 300;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-offer-star-token": token },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (response.ok) return await response.json();
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable) {
        lastError = new Error(`AI 请求失败：${response.status}`);
        break;
      }
      if (attempt >= retries) {
        lastError = new Error(`AI 请求失败：${response.status}`);
        break;
      }
      lastError = new Error(`AI 请求失败：${response.status}`);
      console.warn("[Offer Star][Background] AI 网关返回可重试状态", { 状态码: response.status, 重试次数: attempt + 1 });
    } catch (error) {
      lastError = error instanceof DOMException && error.name === "AbortError" ? new Error("AI 请求超时") : error;
      if (attempt >= retries) break;
      console.warn("[Offer Star][Background] AI 请求异常，将进行有限重试", { 重试次数: attempt + 1, 原因: lastError instanceof Error ? lastError.message : "未知异常" });
    } finally {
      clearTimeout(timer);
    }
    await new Promise<void>((resolve) => setTimeout(resolve, retryDelayMs));
  }
  throw lastError instanceof Error ? lastError : new Error("AI 请求失败，请稍后重试");
}
