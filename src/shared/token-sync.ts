/** 只从 Offer Star 官网的 SECRET_TOKEN storage 事件提取授权，不读取其他 key。 */
export function tokenFromStorageEvent(event: StorageEvent) {
  return event.key === "SECRET_TOKEN" && event.newValue?.trim() ? event.newValue.trim() : null;
}

/** 读取官网当前授权；登录弹窗在同一标签页写入 localStorage 时不会触发 storage 事件，轮询需要使用此函数。 */
export function readOfferStarToken(storage: Storage = localStorage) {
  const token = storage.getItem("SECRET_TOKEN")?.trim();
  return token || null;
}
