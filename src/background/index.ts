import type { ExtensionMessage, ResumeProfile, ResumeSummary } from "../shared/messages";
import { browser } from "wxt/browser";
import { normalizeResumeList, normalizeResumeProfile } from "../shared/resume-profile";
import { requestAiGateway } from "../shared/ai-request";
import { RESUME_SESSION_STORAGE_KEYS, shouldClearExtensionToken } from "../shared/auth-session";
import { clearResumeCacheKeys, isResumeCacheFresh, profileCacheKey, RESUME_LIST_CACHE_KEY, type CachedResumeList, type CachedResumeProfile } from "../shared/resume-cache";
import { shouldForwardPageChange } from "../shared/page-change-routing";

const API_BASE = "https://api.gfjianli.com/api";
const EXTENSION_AI_URL = import.meta.env.VITE_OFFER_STAR_AI_URL || "https://offer.gfjianli.com/api/extension/ai/analyze";

browser.runtime.onInstalled.addListener(() => {
  console.info("[Offer Star][Background] 扩展安装或更新完成");
});

// 浏览器工具栏图标也打开网页内悬浮面板，保持 Chrome、Edge、Firefox 的主交互一致。
// Chromium 使用 action，Firefox MV2 可能仍使用 browserAction；只注册实际存在的 API。
const toolbarApis = browser as unknown as {
  action?: typeof browser.action;
  browserAction?: typeof browser.action;
};
const toolbarAction = toolbarApis.action ?? toolbarApis.browserAction;
toolbarAction?.onClicked.addListener((tab) => {
  if (!tab.id) return;
  console.info("[Offer Star][Background] 用户点击工具栏图标，打开网页内悬浮面板", { 标签页: tab.id });
  void browser.tabs.sendMessage(tab.id, { type: "OPEN_FLOATING_PANEL" }).catch((error) => {
    console.warn("[Offer Star][Background] 当前页面无法打开网页内悬浮面板", error);
  });
});

browser.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  console.info("[Offer Star][Background] 收到消息", { 类型: message.type, 标签页: sender.tab?.id });
  if (message.type === "GET_RESUME_PROFILE") {
    void getResumeProfile(message.resumeId).then(sendResponse).catch((error) => {
      console.error("[Offer Star][Background] 获取简历失败", error);
      sendResponse({ error: error instanceof Error ? error.message : "请求失败" });
    });
    return true;
  }
  if (message.type === "GET_CURRENT_TAB_ID") {
    sendResponse({ tabId: sender.tab?.id ?? null });
    return false;
  }
  if (message.type === "OPEN_OFFER_STAR_LOGIN") {
    // 由后台页创建标签页，避免网页内 iframe 在 Firefox/Chromium 中直接调用 tabs.create 时静默失败。
    void browser.tabs.create({ url: "https://offer.gfjianli.com/?openLogin=1" }).then((tab) => {
      console.info("[Offer Star][Background] 已打开 Offer Star 登录页", { 标签页: tab.id });
      sendResponse({ success: true, tabId: tab.id });
    }).catch((error) => {
      console.error("[Offer Star][Background] 打开 Offer Star 登录页失败", error);
      sendResponse({ success: false, error: "无法打开 Offer Star 登录页，请检查浏览器权限或手动打开官网" });
    });
    return true;
  }
  if (message.type === "OPEN_OFFER_STAR_RESUME") {
    // 简历预览仍由后台页创建标签页，避免网页 iframe 受浏览器弹窗策略影响。
    void browser.tabs.create({ url: "https://offer.gfjianli.com/resume.html?target=resume_assistant" }).then((tab) => {
      console.info("[Offer Star][Background] 已打开简历预览页", { 标签页: tab.id });
      sendResponse({ success: true, tabId: tab.id });
    }).catch((error) => {
      console.error("[Offer Star][Background] 打开简历预览页失败", error);
      sendResponse({ success: false, error: "无法打开简历预览页，请手动打开 Offer Star" });
    });
    return true;
  }
  if (message.type === "SYNC_OFFER_STAR_TOKEN") {
    if (sender.url?.startsWith("https://offer.gfjianli.com/")) {
      void (message.token
        ? browser.storage.local.set({ extensionToken: message.token })
        : browser.storage.local.remove("extensionToken"));
      console.info("[Offer Star][Background] 已同步网站登录状态到扩展", { 已登录: Boolean(message.token) });
      sendResponse({ success: true });
    } else {
      console.warn("[Offer Star][Background] 拒绝非 Offer Star 页面同步登录状态");
      sendResponse({ success: false });
    }
    return false;
  }
  if (message.type === "CLEAR_EXTENSION_TOKEN") {
    void clearResumeSessionStorage().then(() => {
      console.info("[Offer Star][Background] 已清除扩展登录状态");
      sendResponse({ success: true });
    }).catch((error) => {
      console.error("[Offer Star][Background] 清除扩展登录状态失败", error);
      sendResponse({ success: false, error: "清除登录状态失败" });
    });
    return true;
  }
  if (message.type === "GET_RESUME_LIST") {
    void getResumeList().then(sendResponse).catch((error) => {
      console.error("[Offer Star][Background] 获取简历列表失败", error);
      sendResponse({ error: error instanceof Error ? error.message : "请求失败" });
    });
    return true;
  }
  if (message.type === "ANALYZE_PAGE_WITH_AI") {
    void analyzePageWithAi(message).then(sendResponse).catch((error) => {
      console.error("[Offer Star][Background] AI 页面分析失败", error);
      sendResponse({ error: error instanceof Error ? error.message : "AI 分析失败" });
    });
    return true;
  }
  // 只有内容脚本带有 tab 身份时才允许转发，避免后台 runtime.sendMessage 的回传再次进入本分支。
  if ((message.type === "PAGE_CONTEXT_CHANGED" || message.type === "PAGE_FORM_CHANGED") && shouldForwardPageChange(sender.tab?.id)) {
    console.info("[Offer Star][Background] 转发表单页面状态变化", { 类型: message.type, 地址: message.url });
    void browser.runtime.sendMessage(message).catch((error) => {
      console.warn("[Offer Star][Background] 悬浮面板尚未打开，页面状态消息未送达", error);
    });
    return false;
  }
  if (message.type === "SCAN_PAGE" && sender.tab?.id) {
    browser.tabs.sendMessage(sender.tab.id, message).then(sendResponse).catch(() => sendResponse({ fields: [] }));
    return true;
  }
  if (message.type === "FILL_FIELDS" && sender.tab?.id) {
    browser.tabs.sendMessage(sender.tab.id, message).then(sendResponse).catch(() => sendResponse({ filled: [], failed: ["页面通信"], failureReasons: { "页面通信": "无法连接当前页面，请刷新后重试" } }));
    return true;
  }
  return false;
});

async function getResumeProfile(resumeId: string): Promise<ResumeProfile> {
  console.info("[Offer Star][Background] 开始获取简历", { 简历编号: resumeId });
  const { extensionToken } = await browser.storage.local.get("extensionToken") as { extensionToken?: string };
  if (!extensionToken) throw new Error("请先登录 Offer Star");
  const cacheKey = profileCacheKey(resumeId);
  try {
    const response = await requestOfferStar(`/c/resume/${encodeURIComponent(resumeId)}`, extensionToken);
    const profile = normalizeResumeProfile(response);
    await browser.storage.local.set({ [cacheKey]: { value: profile, savedAt: Date.now() } satisfies CachedResumeProfile });
    console.info("[Offer Star][Background] 简历获取成功", { 简历编号: resumeId });
    return profile;
  } catch (error) {
    const stored = await browser.storage.local.get(cacheKey) as Record<string, CachedResumeProfile | undefined>;
    if (isResumeCacheFresh(stored[cacheKey])) {
      console.warn("[Offer Star][Background] 简历接口暂时不可用，使用短时缓存", { 简历编号: resumeId });
      return stored[cacheKey]!.value;
    }
    throw error;
  }
}

async function getResumeList(): Promise<ResumeSummary[]> {
  const { extensionToken } = await browser.storage.local.get("extensionToken") as { extensionToken?: string };
  if (!extensionToken) throw new Error("请先登录 Offer Star");
  try {
    const response = await requestOfferStar("/c/resume/templates/my?page=1&limit=100", extensionToken);
    const list = normalizeResumeList(response);
    await browser.storage.local.set({ [RESUME_LIST_CACHE_KEY]: { value: list, savedAt: Date.now() } satisfies CachedResumeList });
    console.info("[Offer Star][Background] 简历列表获取成功", { 数量: list.length });
    return list;
  } catch (error) {
    const stored = await browser.storage.local.get(RESUME_LIST_CACHE_KEY) as Record<string, CachedResumeList | undefined>;
    if (isResumeCacheFresh(stored[RESUME_LIST_CACHE_KEY])) {
      console.warn("[Offer Star][Background] 简历列表接口暂时不可用，使用短时缓存");
      return stored[RESUME_LIST_CACHE_KEY]!.value;
    }
    throw error;
  }
}

async function clearResumeSessionStorage() {
  const stored = await browser.storage.local.get(null);
  const cacheKeys = clearResumeCacheKeys(Object.keys(stored));
  await browser.storage.local.remove([...RESUME_SESSION_STORAGE_KEYS, ...cacheKeys]);
}

async function requestOfferStar(path: string, token: string): Promise<unknown> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { token } });
  if (!response.ok) {
    console.error("[Offer Star][Background] 简历接口返回异常", { 状态码: response.status, 路径: path });
    if (shouldClearExtensionToken(response.status)) {
      await clearResumeSessionStorage();
      console.warn("[Offer Star][Background] 登录状态已失效，已清除本地扩展授权");
    }
    throw new Error(`简历请求失败：${response.status}`);
  }
  const body = await response.json() as { data?: unknown; code?: number; message?: string };
  if (body.code && body.code !== 200) throw new Error(body.message || `接口返回错误：${body.code}`);
  return body.data ?? body;
}

async function analyzePageWithAi(message: Extract<ExtensionMessage, { type: "ANALYZE_PAGE_WITH_AI" }>) {
  const { extensionToken } = await browser.storage.local.get("extensionToken") as { extensionToken?: string };
  if (!extensionToken) throw new Error("请先登录 Offer Star");
  try {
    return await requestAiGateway(EXTENSION_AI_URL, extensionToken, {
      pageUrl: message.pageUrl,
      siteId: message.siteId,
      jobDescription: message.jobDescription,
      fields: message.fields,
      resume: message.resume,
      draftInstruction: message.draftInstruction
    }, {
      timeoutMs: 15_000,
      retries: 1,
      retryDelayMs: 500
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("AI 请求失败：401")) {
      await clearResumeSessionStorage();
      console.warn("[Offer Star][Background] AI 网关判定登录失效，已清除本地扩展授权");
    }
    throw error;
  }
}
