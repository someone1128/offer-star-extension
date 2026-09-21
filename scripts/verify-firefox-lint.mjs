import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["web-ext", "lint", "--source-dir", ".output/firefox-mv2", "--output", "json"], { encoding: "utf8", shell: process.platform === "win32" });
if (result.error) throw result.error;

const report = JSON.parse(result.stdout);
if (report.errors?.length) {
  console.error("Firefox lint 存在错误", report.errors);
  process.exit(1);
}

const unexpectedWarnings = (report.warnings ?? []).filter((warning) => (
  warning.code !== "UNSAFE_VAR_ASSIGNMENT"
  || (!String(warning.file ?? "").startsWith("chunks/floating-panel-") && !String(warning.file ?? "").startsWith("chunks/main-"))
));
if (unexpectedWarnings.length) {
  console.error("Firefox lint 存在未登记的警告", unexpectedWarnings);
  process.exit(1);
}

console.log(`Firefox lint 通过：错误 0，已登记 React 打包警告 ${report.warnings?.length ?? 0} 项`);
