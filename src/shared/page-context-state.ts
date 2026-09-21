/** 生成页面切换或刷新后的悬浮面板恢复提示，避免用户误以为附件仍然绑定在新页面。 */
export function getPageContextChangedMessage(hasPendingAttachments: boolean) {
  return hasPendingAttachments
    ? "页面已刷新或切换，请重新扫描表单；待确认附件需要重新选择"
    : "页面已切换，请重新扫描当前申请表单";
}
