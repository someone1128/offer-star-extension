/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { installNavigationObserver } from "../src/shared/navigation-observer";

describe("SPA 页面导航监听", () => {
  it("监听 pushState 和 replaceState，并且清理后不再触发", () => {
    const changes: Array<{ url: string; reason: string }> = [];
    const cleanup = installNavigationObserver(window, (change) => changes.push(change));
    window.history.pushState({}, "", "/job/2");
    window.history.replaceState({}, "", "/job/3");
    expect(changes.map((change) => change.reason)).toEqual(["pushState", "replaceState"]);
    cleanup();
    window.history.pushState({}, "", "/job/4");
    expect(changes).toHaveLength(2);
  });

  it("同一个 URL 重复触发事件不会重复通知", () => {
    const changes: string[] = [];
    const cleanup = installNavigationObserver(window, ({ url }) => changes.push(url));
    window.history.pushState({}, "", window.location.href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(changes).toHaveLength(0);
    cleanup();
  });
});
