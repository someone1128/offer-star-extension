import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), ".output", "chrome-mv3");
const files = ["background.js", "manifest.json", "floating-panel.html"];
const forbidden = ["127.0.0.1:4173", "localhost:4173", "/api/mock-ai", "VITE_OFFER_STAR_AI_URL"];
const hits = [];

try {
  await access(join(process.cwd(), "dist"));
  console.error("发现历史 dist/ 产物；当前扩展只能从 .output/* 目录加载，避免误装旧登录协议");
  process.exit(1);
} catch {
  // dist 不存在才是当前 WXT 构建的预期状态。
}

for (const file of files) {
  const content = await readFile(join(outputRoot, file), "utf8");
  for (const marker of forbidden) {
    if (content.includes(marker)) hits.push(`${file}: ${marker}`);
  }
}

if (hits.length) {
  console.error("生产扩展产物包含测试 AI 地址，禁止发布", hits);
  process.exit(1);
}
console.log("生产扩展产物检查通过：未发现本地 AI mock 地址");
