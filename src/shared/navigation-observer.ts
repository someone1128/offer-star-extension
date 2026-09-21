export type NavigationChange = { url: string; reason: "pushState" | "replaceState" | "popstate" | "hashchange" };

/** 监听 SPA 导航，返回清理函数，避免重复安装监听器。 */
export function installNavigationObserver(win: Window, onChange: (change: NavigationChange) => void) {
  let lastUrl = win.location.href;
  const notify = (reason: NavigationChange["reason"]) => {
    const url = win.location.href;
    if (url === lastUrl) return;
    lastUrl = url;
    onChange({ url, reason });
  };
  const originalPushState = win.history.pushState.bind(win.history);
  const originalReplaceState = win.history.replaceState.bind(win.history);
  win.history.pushState = function pushState(...args) {
    const result = originalPushState(...args);
    notify("pushState");
    return result;
  };
  win.history.replaceState = function replaceState(...args) {
    const result = originalReplaceState(...args);
    notify("replaceState");
    return result;
  };
  const onPopState = () => notify("popstate");
  const onHashChange = () => notify("hashchange");
  win.addEventListener("popstate", onPopState);
  win.addEventListener("hashchange", onHashChange);
  return () => {
    win.history.pushState = originalPushState;
    win.history.replaceState = originalReplaceState;
    win.removeEventListener("popstate", onPopState);
    win.removeEventListener("hashchange", onHashChange);
  };
}
