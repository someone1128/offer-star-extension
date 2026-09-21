/** 计算简历菜单键盘导航的下一个索引，列表为空时返回 -1。 */
export function nextResumeIndex(current: number, direction: "next" | "previous", count: number) {
  if (count <= 0) return -1;
  const safeCurrent = Number.isInteger(current) && current >= 0 && current < count ? current : 0;
  return direction === "next" ? (safeCurrent + 1) % count : (safeCurrent - 1 + count) % count;
}
