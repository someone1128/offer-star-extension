import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Playwright 用例单独由 npm run test:e2e 执行，避免 Vitest 把浏览器测试当成单元测试加载。
    exclude: ["tests/e2e/**", "node_modules/**"]
  }
});
