/** AI 请求返回时的页面状态校验，避免旧页面结果污染当前悬浮面板。 */
export function canApplyAiResult(input: {
  requestId: number;
  activeRequestId: number;
  requestRevision: number;
  currentRevision: number;
  requestedTabId: number;
  currentTabId?: number;
  requestedUrl: string;
  currentUrl?: string;
}) {
  return input.requestId === input.activeRequestId
    && input.requestRevision === input.currentRevision
    && input.requestedTabId === input.currentTabId
    && input.requestedUrl === input.currentUrl;
}
