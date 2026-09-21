import net from "node:net";

/**
 * 通过 Firefox Remote Debugging Protocol 做只读页面冒烟检查。
 * 这个脚本只读取标签页 URL 和悬浮球 DOM，不执行点击、不填写表单，也不读取登录凭证。
 */
const port = Number(process.env.FIREFOX_DEBUG_PORT || 9728);
const expectedHost = process.env.FIREFOX_SMOKE_HOST || "www.zhipin.com";
const expectedSelectors = (process.env.FIREFOX_SMOKE_SELECTORS || "").split(",").map((selector) => selector.trim()).filter(Boolean);
const timeoutMs = 5000;

function sanitizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return `${url.host}${url.pathname}`;
  } catch {
    return "当前页面";
  }
}

function connect() {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error(`无法在 ${port} 端口连接 Firefox 调试服务`));
    }, timeoutMs);
    socket.once("connect", () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function createProtocol(socket) {
  let buffer = Buffer.alloc(0);
  const waiting = [];
  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const separator = buffer.indexOf(58);
      if (separator < 0) break;
      const length = Number(buffer.subarray(0, separator).toString());
      if (!Number.isInteger(length) || buffer.length < separator + 1 + length) break;
      const payload = buffer.subarray(separator + 1, separator + 1 + length).toString();
      buffer = buffer.subarray(separator + 1 + length);
      const packet = JSON.parse(payload);
      waiting.shift()?.(packet);
    }
  });
  const receive = () => new Promise((resolve) => waiting.push((packet) => resolve(packet)));
  const send = (packet) => {
    const payload = Buffer.from(JSON.stringify(packet));
    socket.write(Buffer.concat([Buffer.from(`${payload.length}:`), payload]));
  };
  return { receive, send };
}

async function request(protocol, packet, predicate = () => true) {
  protocol.send(packet);
  while (true) {
    const response = await Promise.race([
      protocol.receive(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Firefox 调试响应超时")), timeoutMs))
    ]);
    if (predicate(response)) return response;
  }
}

async function main() {
  let socket;
  try {
    socket = await connect();
    const protocol = createProtocol(socket);
    const tabsResponse = await request(protocol, { to: "root", type: "listTabs" }, (packet) => Array.isArray(packet.tabs));
    const tab = tabsResponse.tabs.find((candidate) => {
      try { return new URL(candidate.url).hostname === expectedHost; } catch { return false; }
    });
    if (!tab) throw new Error(`未找到 ${expectedHost} 标签页，请先打开目标招聘页面`);

    const targetResponse = await request(protocol, { to: tab.actor, type: "getTarget" }, (packet) => Boolean(packet.frame?.inspectorActor));
    const walkerResponse = await request(protocol, { to: targetResponse.frame.inspectorActor, type: "getWalker", options: {} }, (packet) => Boolean(packet.walker?.root));
    const querySelector = (selector) => request(protocol, {
      to: walkerResponse.walker.actor,
      type: "querySelector",
      node: walkerResponse.walker.root.actor,
      selector
    }, (packet) => Object.hasOwn(packet, "node"));
    const launcherResponse = await querySelector("#offer-star-floating-launcher");

    if (!launcherResponse.node) throw new Error("目标页面未发现 Offer Star 悬浮球");
    const attrs = Object.fromEntries((launcherResponse.node.attrs ?? []).map((item) => [item.name, item.value]));
    if (attrs["aria-label"] !== "打开 Offer Star 简历助手") throw new Error("悬浮球无预期无障碍标签");
    const missingSelectors = [];
    for (const selector of expectedSelectors) {
      const result = await querySelector(selector);
      if (!result.node) missingSelectors.push(selector);
    }
    if (missingSelectors.length) throw new Error(`真实页面缺少预期控件：${missingSelectors.join("、")}`);

    const pageUrl = sanitizeUrl(tab.url);
    const securityBlocked = /_security_check|captcha|security[_-]?check/i.test(tab.url);
    console.log("Firefox 页面冒烟通过：", { 页面: pageUrl, 悬浮球: "已注入", 预期控件: expectedSelectors.length || "未指定", 安全验证页: securityBlocked ? "是，已按设计停止扫描" : "否" });
  } catch (error) {
    console.error("Firefox 页面冒烟失败：", error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    socket?.destroy();
  }
}

await main();
