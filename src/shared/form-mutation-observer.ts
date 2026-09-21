/** 监听表单结构变化；只观察子节点变化，避免输入值变化造成频繁提示。 */
export function installFormMutationObserver(document: Document, onChange: () => void, isSuppressed: () => boolean, debounceMs = 250) {
  if (!document.body || typeof MutationObserver === "undefined") return () => undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const observer = new MutationObserver(() => {
    if (isSuppressed()) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (!isSuppressed()) onChange();
    }, debounceMs);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };
}
