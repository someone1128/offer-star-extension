import { chromium, expect, test, type BrowserContext, type Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const extensionPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.output/chrome-mv3");
const headed = process.env.EXTENSION_E2E_HEADED === "1";
const configuredBrowser = process.env.CHROME_EXECUTABLE_PATH;
const edgeExecutable = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const chromeExecutable = configuredBrowser || (existsSync(edgeExecutable) ? edgeExecutable : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");

test("真实扩展可以通过本地 AI 网关审核并拒绝草稿", async () => {
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  try {
    context = await chromium.launchPersistentContext("", {
      headless: !headed,
      ...(headed ? { executablePath: chromeExecutable } : {}),
      args: [...(headed ? [] : ["--headless=new"]), `--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    });
    page = await context.newPage();
    const serviceWorker = context.serviceWorkers()[0] ?? await context.waitForEvent("serviceworker");
    await serviceWorker.evaluate(async () => {
      const now = Date.now();
      await chrome.storage.local.clear();
      await chrome.storage.local.set({
        extensionToken: "e2e-ai-token",
        "resumeCache:list": { value: [{ id: "e2e-ai-resume", title: "AI 审核测试简历" }], savedAt: now },
        "resumeCache:profile:e2e-ai-resume": {
          value: {
            basic: { name: "AI 测试用户", phone: "13800000000", email: "ai@example.com" },
            education: [], workExperience: [], projectExperience: [], skills: ["TypeScript"], selfIntroduction: "有招聘产品经验"
          },
          savedAt: now
        }
      });
    });
    await page.goto("http://127.0.0.1:4173/simple.html");
    await page.getByRole("button", { name: "打开 Offer Star 简历助手" }).click();
    const panel = page.frameLocator("#offer-star-floating-panel iframe");
    await expect(panel.getByText("AI 审核测试简历")).toBeVisible();
    await panel.getByRole("button", { name: "扫描当前页面" }).click();
    const aiButton = panel.getByRole("button", { name: "AI 分析未识别字段" });
    await aiButton.click();
    await expect(panel.getByRole("button", { name: "AI 分析中…" })).toBeDisabled();
    await expect(panel.getByText("AI 已生成审核结果")).toBeVisible();
    const draft = panel.locator(".draft-card textarea");
    await expect(draft).toHaveValue("建议候选文案");
    await draft.fill("用户确认后的自定义文案");
    await panel.getByRole("button", { name: "拒绝" }).click();
    await expect(panel.locator(".draft-card")).toHaveCount(0);
  } finally {
    const worker = context?.serviceWorkers()[0];
    if (worker) await worker.evaluate(async () => chrome.storage.local.clear());
    await page?.close();
    await context?.close();
  }
});
