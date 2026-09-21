import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const run = (args, env = process.env) => spawnSync(command, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env
});

const e2eEnv = { ...process.env, OFFER_STAR_E2E_AI: "1", VITE_OFFER_STAR_AI_URL: "http://127.0.0.1:4173/api/mock-ai" };
let exitCode = 1;
try {
  const build = run(["wxt", "build", "-b", "chrome"], e2eEnv);
  if (build.status !== 0) process.exit(build.status ?? 1);
  const test = run(["playwright", "test", "tests/e2e/ai-extension.spec.ts"], {
    ...e2eEnv,
    EXTENSION_E2E_HEADED: "1",
    EXTENSION_E2E_ASSERT_EXTENSION: "1"
  });
  exitCode = test.status ?? 1;
} finally {
  // 测试产物可能包含 localhost AI 地址，结束时必须恢复默认生产构建。
  const restore = run(["wxt", "build", "-b", "chrome"], process.env);
  if (exitCode === 0 && restore.status !== 0) exitCode = restore.status ?? 1;
}
process.exit(exitCode);
