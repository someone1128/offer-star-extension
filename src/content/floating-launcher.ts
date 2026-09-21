/** 创建网页悬浮入口；浏览器通信由调用方注入，便于跨浏览器和单元测试。 */
export function mountFloatingLauncher(document: Document, onOpen: () => void) {
  const existing = document.getElementById("offer-star-floating-launcher");
  if (existing) return existing as HTMLButtonElement;

  const launcher = document.createElement("button");
  launcher.id = "offer-star-floating-launcher";
  launcher.type = "button";
  launcher.textContent = "✦";
  launcher.title = "打开 Offer Star 简历助手";
  launcher.setAttribute("aria-label", "打开 Offer Star 简历助手");
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "offer-star-floating-panel");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  Object.assign(launcher.style, {
    position: "fixed", right: "20px", bottom: "88px", zIndex: "2147483647",
    width: "48px", height: "48px", border: "1px solid rgba(255,255,255,.7)", borderRadius: "16px",
    background: "linear-gradient(145deg, #1769ed, #7651e9)", color: "#fff", fontFamily: "system-ui, sans-serif", fontSize: "23px", fontWeight: "800", cursor: "pointer",
    boxShadow: "0 10px 24px rgba(49,91,183,.34), 0 0 0 5px rgba(93,133,235,.10)", outlineOffset: "3px", transition: reducedMotion ? "none" : "transform .18s ease, box-shadow .18s ease"
  });
  launcher.addEventListener("mouseenter", () => { launcher.style.transform = "translateY(-2px) scale(1.04)"; launcher.style.boxShadow = "0 14px 28px rgba(49,91,183,.42), 0 0 0 6px rgba(93,133,235,.14)"; });
  launcher.addEventListener("mouseleave", () => { launcher.style.transform = "translateY(0) scale(1)"; launcher.style.boxShadow = "0 10px 24px rgba(49,91,183,.34), 0 0 0 5px rgba(93,133,235,.10)"; });
  launcher.addEventListener("focus", () => { launcher.style.outline = "3px solid rgba(75, 132, 241, .72)"; });
  launcher.addEventListener("blur", () => { launcher.style.outline = "none"; });
  launcher.addEventListener("click", onOpen);
  document.documentElement.appendChild(launcher);
  return launcher;
}

/** 控制悬浮球的显示状态，面板展开时避免遮挡面板底部操作区。 */
export function setFloatingLauncherVisible(document: Document, visible: boolean) {
  const launcher = document.getElementById("offer-star-floating-launcher") as HTMLButtonElement | null;
  if (launcher) {
    launcher.style.display = visible ? "block" : "none";
    launcher.setAttribute("aria-expanded", String(!visible));
  }
}

/** 在当前网页内挂载真正的悬浮面板，使用 iframe 隔离扩展 UI 与宿主网站样式。 */
export function mountFloatingPanel(document: Document, panelUrl: string) {
  const existing = document.getElementById("offer-star-floating-panel");
  if (existing) return existing as HTMLDivElement;
  const panel = document.createElement("div");
  panel.id = "offer-star-floating-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Offer Star 简历助手");
  panel.setAttribute("aria-modal", "false");
  Object.assign(panel.style, { position: "fixed", right: "20px", bottom: "20px", zIndex: "2147483646", width: "min(400px, calc(100vw - 32px))", height: "min(760px, calc(100vh - 40px))", minHeight: "420px", background: "#fff", border: "1px solid #d9e2f2", borderRadius: "14px", overflow: "hidden", boxShadow: "0 12px 40px rgba(15, 35, 75, .24)" });
  const frame = document.createElement("iframe");
  frame.id = "offer-star-floating-panel-frame";
  frame.title = "Offer Star 简历助手悬浮面板";
  frame.src = panelUrl;
  frame.setAttribute("allow", "clipboard-read; clipboard-write");
  Object.assign(frame.style, { display: "block", width: "100%", height: "100%", border: "0" });
  panel.appendChild(frame);
  document.documentElement.appendChild(panel);
  console.info("[Offer Star][Content] 已挂载网页内悬浮面板");
  return panel;
}

/** 删除当前页面的悬浮面板，避免跨页面复用旧字段状态。 */
export function unmountFloatingPanel(document: Document) {
  document.getElementById("offer-star-floating-panel")?.remove();
}
