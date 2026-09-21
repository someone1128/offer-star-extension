import { expect, test } from "@playwright/test";

test.describe("网申测试表单", () => {
  test("页面展示核心字段和照片控件", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "测试网申表单" })).toBeVisible();
    await expect(page.getByLabel("姓名")).toHaveValue("已有姓名");
    await expect(page.getByLabel("手机号")).toBeVisible();
    await expect(page.getByLabel("证件照")).toBeVisible();
  });

  test("原生下拉框可以选择学历", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("学历").selectOption({ label: "本科" });
    await expect(page.getByLabel("学历")).toHaveValue("本科");
  });

  test("已有内容可以被测试用例识别为覆盖目标", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("姓名").fill("覆盖后的姓名");
    await expect(page.getByLabel("姓名")).toHaveValue("覆盖后的姓名");
  });

  test("BOSS 风格页面的自定义职位下拉框可展开并选择", async ({ page }) => {
    await page.goto("/boss.html");
    const position = page.getByRole("combobox", { name: "期望职位" });
    await position.click();
    await page.getByRole("option", { name: "产品经理" }).click();
    await expect(position).toHaveText("产品经理");
    await expect(position).toHaveAttribute("aria-expanded", "false");
  });

  test("照片控件可以被用户选择", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("证件照").setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from([137, 80, 78, 71]) });
    await expect(page.getByLabel("证件照")).toHaveValue(/photo\.png/);
  });

  test("多文件附件控件可以被用户选择", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("上传简历附件").setInputFiles([
      { name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") },
      { name: "portfolio.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buffer: Buffer.from("docx") }
    ]);
    await expect(page.getByLabel("上传简历附件")).toHaveValue(/resume\.pdf/);
    await expect(page.getByLabel("上传简历附件").evaluate((element) => (element as HTMLInputElement).files?.length)).resolves.toBe(2);
  });
});
