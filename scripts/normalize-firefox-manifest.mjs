import { readFile, writeFile } from "node:fs/promises";

const manifestPath = ".output/firefox-mv2/manifest.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

// Firefox 构建仍可能继承 Chromium 的 sidePanel 权限，构建后统一清理，保持网页内悬浮面板入口。
manifest.permissions = (manifest.permissions ?? []).filter((permission) => permission !== "sidePanel");
delete manifest.side_panel;

await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`, "utf8");
console.log("Firefox Manifest 已清理 Chromium sidePanel 权限，保持网页内悬浮面板入口");
