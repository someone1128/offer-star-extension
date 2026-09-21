import type { ExtensionMessage } from "../shared/messages";
import { browser } from "wxt/browser";
import { createDomEngine } from "./dom-engine";
import { extractPageContext } from "../shared/page-context";
import { installNavigationObserver } from "../shared/navigation-observer";
import { installFormMutationObserver } from "../shared/form-mutation-observer";
import { mountFloatingLauncher, mountFloatingPanel, setFloatingLauncherVisible, unmountFloatingPanel } from "./floating-launcher";
import { readOfferStarToken, tokenFromStorageEvent } from "../shared/token-sync";
import { detectSecurityChallenge } from "../shared/security-page";

let engine = createDomEngine(document, location.href);
let hasScanned = false;
let suppressFormMutationNotice = false;

installNavigationObserver(window, ({ url, reason }) => {
  engine = createDomEngine(document, url);
  hasScanned = false;
  unmountFloatingPanel(document);
  setFloatingLauncherVisible(document, true);
  console.info("[Offer Star][Content] 检测到页面导航，已使旧字段映射失效", { 地址: url, 原因: reason });
  void browser.runtime.sendMessage({ type: "PAGE_CONTEXT_CHANGED", url, reason });
});

installFormMutationObserver(document, () => {
  if (!hasScanned) return;
  console.info("[Offer Star][Content] 检测到表单结构异步更新，提示重新扫描", { 地址: location.href });
  void browser.runtime.sendMessage({ type: "PAGE_FORM_CHANGED", url: location.href });
}, () => suppressFormMutationNotice);

// 在网页右下角提供轻量入口，用户不需要反复打开浏览器工具栏。
const openFloatingPanel = () => {
  console.info("[Offer Star][Content] 用户点击网页悬浮入口，准备打开网页内面板");
  void browser.runtime.sendMessage({ type: "GET_CURRENT_TAB_ID" }).then((result: { tabId?: number | null }) => {
    const tabId = result?.tabId;
    if (!Number.isInteger(tabId) || (tabId as number) <= 0) throw new Error("无法确定当前标签页");
    const runtimeWithUrl = browser.runtime as typeof browser.runtime & { getURL: (path: string) => string };
    mountFloatingPanel(document, `${runtimeWithUrl.getURL("floating-panel.html")}?embedded=1&tabId=${tabId}`);
    setFloatingLauncherVisible(document, false);
  }).catch((error) => {
    console.error("[Offer Star][Content] 网页内悬浮面板打开失败", error);
  });
};

mountFloatingLauncher(document, openFloatingPanel);

window.addEventListener("message", (event) => {
  const frame = document.getElementById("offer-star-floating-panel-frame") as HTMLIFrameElement | null;
  if (!frame || event.source !== frame.contentWindow) return;
  if (event.data?.type === "OFFER_STAR_CLOSE_FLOATING_PANEL") {
    console.info("[Offer Star][Content] 用户关闭网页内悬浮面板");
    unmountFloatingPanel(document);
    setFloatingLauncherVisible(document, true);
  }
});

browser.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  console.info("[Offer Star][Content] 收到消息", { 类型: message.type });
  if (message.type === "SCAN_PAGE") {
    const blockedReason = detectSecurityChallenge(document, location.href);
    if (blockedReason) {
      hasScanned = false;
      console.warn("[Offer Star][Content] 检测到安全验证页面，已停止字段扫描", { 原因: blockedReason });
      sendResponse({ fields: [], blockedReason });
      return false;
    }
    void engine.scanDeep().then((fields) => { hasScanned = true; sendResponse({ fields }); });
    return true;
  }
  if (message.type === "OPEN_FLOATING_PANEL") {
    openFloatingPanel();
    return false;
  }
  if (message.type === "GET_PAGE_CONTEXT") {
    sendResponse(extractPageContext(document, location.href));
    return false;
  }
  if (message.type === "FILL_FIELDS") {
    suppressFormMutationNotice = true;
    void engine.fill(message.values, message.mode).then(sendResponse).finally(() => { suppressFormMutationNotice = false; });
    return true;
  }
  if (message.type === "UNDO_FILL") {
    void engine.undo().then(sendResponse);
    return true;
  }
  if (message.type === "ADVANCE_FORM_STEP") {
    void engine.advanceStep().then(sendResponse);
    return true;
  }
  if (message.type === "FILL_PHOTO") {
    void engine.fillPhoto(message.dataUrl, message.fileName, message.mimeType).then(sendResponse);
    return true;
  }
  if (message.type === "FILL_FILES") {
    void engine.fillFiles(message.files).then(sendResponse);
    return true;
  }
  return false;
});

// 只在 Offer Star 官网同步当前登录状态，不读取其他网站的 localStorage。
if (location.hostname === "offer.gfjianli.com") {
  let lastOfferStarToken: string | null | undefined;
  const syncOfferStarToken = (token: string | null, source: string) => {
    if (token === lastOfferStarToken) return;
    lastOfferStarToken = token;
    console.info("[Offer Star][Content] 官网登录状态发生变化，申请同步扩展授权", { 来源: source, 已登录: Boolean(token) });
    void browser.runtime.sendMessage({ type: "SYNC_OFFER_STAR_TOKEN", token });
  };
  syncOfferStarToken(readOfferStarToken(), "页面初始化");
  window.addEventListener("storage", (event) => {
    if (event.key !== "SECRET_TOKEN") return;
    syncOfferStarToken(tokenFromStorageEvent(event), "storage 事件");
  });
  // 登录弹窗与当前页面属于同一文档时，storage 事件不会在当前文档触发；短轮询确保登录后无需刷新页面。
  window.setInterval(() => syncOfferStarToken(readOfferStarToken(), "登录状态轮询"), 1000);
}
