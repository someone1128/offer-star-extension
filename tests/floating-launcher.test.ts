/** @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";
import { mountFloatingLauncher, mountFloatingPanel, setFloatingLauncherVisible, unmountFloatingPanel } from "../src/content/floating-launcher";

describe("网页悬浮入口", () => {
  it("创建可访问按钮并在点击时触发打开回调", () => {
    const onOpen = vi.fn();
    const launcher = mountFloatingLauncher(document, onOpen);
    expect(launcher.id).toBe("offer-star-floating-launcher");
    expect(launcher.textContent).toBe("✦");
    expect(launcher.style.background).toContain("linear-gradient");
    expect(launcher.style.borderRadius).toBe("16px");
    expect(launcher.getAttribute("aria-label")).toBe("打开 Offer Star 简历助手");
    expect(launcher.getAttribute("aria-haspopup")).toBe("dialog");
    expect(launcher.getAttribute("aria-expanded")).toBe("false");
    expect(launcher.getAttribute("aria-controls")).toBe("offer-star-floating-panel");
    launcher.click();
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("键盘聚焦时显示可见焦点环，并在离开后清理样式", () => {
    const launcher = mountFloatingLauncher(document, () => undefined);
    launcher.dispatchEvent(new FocusEvent("focus"));
    expect(launcher.style.outline).toContain("solid");
    launcher.dispatchEvent(new FocusEvent("blur"));
    expect(launcher.style.outline).toBe("none");
  });

  it("重复挂载时复用原按钮，不创建重复入口", () => {
    const first = mountFloatingLauncher(document, () => undefined);
    const second = mountFloatingLauncher(document, () => undefined);
    expect(second).toBe(first);
    expect(document.querySelectorAll("#offer-star-floating-launcher")).toHaveLength(1);
  });

  it("在当前网页创建隔离的悬浮面板并支持卸载", () => {
    const first = mountFloatingPanel(document, "chrome-extension://test/floating-panel.html?embedded=1&tabId=7");
    const second = mountFloatingPanel(document, "ignored");
    expect(second).toBe(first);
    expect(first.getAttribute("role")).toBe("dialog");
    expect(first.getAttribute("aria-modal")).toBe("false");
    expect(first.querySelector("iframe")?.getAttribute("src")).toBe("chrome-extension://test/floating-panel.html?embedded=1&tabId=7");
    expect(document.querySelectorAll("#offer-star-floating-panel")).toHaveLength(1);
    unmountFloatingPanel(document);
    expect(document.querySelector("#offer-star-floating-panel")).toBeNull();
  });

  it("面板展开时隐藏悬浮球，卸载后可以恢复显示", () => {
    const launcher = mountFloatingLauncher(document, () => undefined);
    setFloatingLauncherVisible(document, false);
    expect(launcher.style.display).toBe("none");
    expect(launcher.getAttribute("aria-expanded")).toBe("true");
    setFloatingLauncherVisible(document, true);
    expect(launcher.style.display).toBe("block");
    expect(launcher.getAttribute("aria-expanded")).toBe("false");
  });
});
