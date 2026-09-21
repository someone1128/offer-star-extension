/** 页面变化消息只允许来自有标签页身份的内容脚本。 */
export function shouldForwardPageChange(senderTabId: number | undefined) {
  return typeof senderTabId === "number" && Number.isInteger(senderTabId) && senderTabId > 0;
}
