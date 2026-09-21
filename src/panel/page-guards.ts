/** 页面表单发生异步更新后，旧扫描结果不能继续驱动写入或导航。 */
export function getStalePageMessage(pageStale: boolean, action: string) {
  return pageStale ? `页面表单已更新，不能${action}，请重新扫描后再试` : null;
}
