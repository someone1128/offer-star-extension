import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sources = {
  extension: resolve(root, "src/shared/messages.ts"),
  web: resolve(root, "../offer-star-web/lib/extension-ai.ts"),
  node: resolve(root, "../resume-node/src/modules/extension/extension-ai-routes.ts")
};

function extract(sourceName, pattern) {
  const source = readFileSync(sources[sourceName], "utf8");
  const block = source.match(pattern)?.[1];
  if (!block) throw new Error(`无法读取 ${sourceName} 的字段契约`);
  return [...block.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

const fields = {
  extension: extract("extension", /export type FieldKey\s*=([\s\S]*?);/),
  web: extract("web", /extensionFieldKeySchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\);/),
  node: extract("node", /const fieldKey\s*=\s*z\.enum\(\[([\s\S]*?)\]\);/)
};

const expected = fields.extension.join("\u0000");
const mismatches = Object.entries(fields)
  .filter(([name, values]) => name !== "extension" && values.join("\u0000") !== expected)
  .map(([name]) => name);

if (mismatches.length) {
  console.error("[Offer Star][Contract] 插件、Web 和 Node 的字段契约不一致", { 不一致项目: mismatches, 字段: fields });
  process.exitCode = 1;
} else {
  console.info("[Offer Star][Contract] 插件、Web 和 Node 字段契约一致", { 字段数量: fields.extension.length });
}
