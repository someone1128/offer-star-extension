/** 判断扩展登录 token 是否发生变化，包含登录和退出登录两种方向。 */
export function hasExtensionTokenChange(changes: Record<string, unknown>, areaName: string) {
  return areaName === "local" && Object.prototype.hasOwnProperty.call(changes, "extensionToken");
}
