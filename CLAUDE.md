# Offer Star 浏览器插件交接说明

更新日期：2026-09-22

这是一份换电脑后继续开发的工作交接文档。当前仓库地址是：<https://github.com/someone1128/offer-star-extension>。

## 当前产品目标

为 Offer Star 提供跨 Chrome、Edge、Firefox 的网页内简历助手：用户在招聘网站申请页面点击悬浮球，打开右侧悬浮面板，选择自己的简历，扫描页面字段，确认后填写。插件负责识别和填写，不负责最终投递；AI 只用于字段映射和草稿建议，不能绕过网站安全验证。

## 当前技术实现

- WXT + React + TypeScript + Vite。
- `entrypoints/content.ts` 和 `src/content/` 负责页面注入、悬浮球、表单扫描与填写。
- `src/panel/main.tsx` 和 `src/panel/styles.css` 负责网页内悬浮面板，面板通过 iframe 隔离。
- `src/background/` 负责工具栏入口、打开 Offer Star 登录/简历页、缓存和 AI 消息。
- `src/shared/dom-engine.ts` 相关逻辑分散在 `src/content/dom-engine.ts` 与 shared 模块中，优先复用通用规则。
- `src/shared/site-adapters.ts` 当前已有约 65 个非 generic adapter，覆盖 BOSS 直聘、智联、前程无忧、猎聘、拉勾、牛客、实习僧、应届生、Moka/北森 ATS 等；这些 adapter 的域名识别和脱敏夹具已测，但不等于所有真实网站都已完成登录态填写验收。
- AI 请求由 `offer-star-web` 代理，插件不保存 DeepSeek API Key。

## 已完成并有证据的内容

- Chrome、Edge、Firefox 三套 WXT 构建和 Manifest 检查。
- 网页悬浮球、右侧悬浮面板、关闭清理、工具栏入口共用面板。
- 通用文本框、文本域、原生下拉、日期、复选框安全边界、照片/简历附件路由、Shadow DOM、同源 iframe、动态字段和页面版本过期保护。
- “仅填写新增内容 / 全部覆盖重填”、撤销本次填写、低置信度字段确认、失败诊断和开发期中文日志。
- Offer Star 登录打开逻辑使用 `openLogin=1`，并有登录失败超时提示；登录态和简历缓存有扩展 E2E。
- AI 本地脱敏 mock E2E 已覆盖 Service Worker 请求、分析中状态、草稿编辑和拒绝。
- 面板桌面和 320px 窄屏已做截图检查，面板不能横向溢出。
- Firefox 临时 profile 已经验证过扩展安装和本地脱敏页面悬浮球 DOM 注入；真实 Firefox 页面检查脚本只读。

最近一次已知通过的门禁包括扩展单元测试、三浏览器构建、Manifest/契约/密钥扫描和 Edge 扩展 E2E。每次继续开发后必须重新运行命令，不要只引用这份历史记录。

## 当前未完成和已知限制

### P0：恢复后优先处理

1. **确认 Firefox 自动夹具命令**：`scripts/firefox-fixture-smoke.mjs` 已加入，但在 Windows 上的 web-ext 调试参数仍需重新运行确认。执行 `npm run test:firefox:fixture`，如果失败，保留中文进程日志并修复脚本；不能把失败标为通过。
2. **BOSS 真实页面填写验收**：用户已经登录过 BOSS 直聘，但此前页面命中了 BOSS 安全验证边界，插件按设计停止扫描。恢复后请由用户在自己的 Firefox 页面打开真实申请表，先完成网站要求的安全验证，再由用户点击“扫描当前页面”和“一键填写”。不要自动处理验证码。
3. **Offer Star 生产登录链路**：本地 `offer-star-web` 的 `openLogin=1` 测试通过；生产域名 `https://offer.gfjianli.com` 的最新插件登录链路还需要部署网站端后重新做线上冒烟。没有部署凭据时不要擅自发布。

### P1：真实站点回归

按 `docs/LOGIN_REQUIRED_SITE_CHECKLIST.md` 逐个由用户登录并验收重点站点：BOSS 直聘、智联招聘、前程无忧、猎聘、拉勾、牛客、实习僧、应届生以及 Moka/北森 ATS。每个站点记录浏览器、脱敏 URL、扫描字段数、成功字段、失败字段和是否触发验证码；不要记录账号、密码、手机号、邮箱、身份证或简历原文。

每个真实站点至少完成：

1. 悬浮球和悬浮面板能打开。
2. 站点名称和“专用适配/通用规则”状态正确。
3. 至少三个核心字段能被识别。
4. 用户确认后字段真实写入，非法值被拒绝。
5. 页面异步变化后旧结果失效并要求重新扫描。
6. 不会自动点击投递或提交。

### P2：稳定性和发布准备

- 完善 Firefox 自动夹具脚本和 CI 可执行的无头/临时 profile 方案。
- 为高频站点补充动态下拉、分步表单、跨域 iframe 和附件控件的脱敏夹具。
- 统计真实失败字段，但只存脱敏指标；根据数据补充 `site-field-overrides.ts`。
- 生产稳定后再降低冗余日志，不要在开发阶段删除定位所需日志。
- 确认扩展商店 Manifest、隐私说明、权限说明和网站端生产环境变量，再制作发布包。

## 你恢复电脑后需要完成的事项

1. 安装 Node.js 20+、Git、Chrome/Edge、Firefox，并确认 Firefox 安装路径。
2. 克隆仓库并安装依赖：

   ```powershell
   git clone https://github.com/someone1128/offer-star-extension.git
   cd offer-star-extension
   npm ci
   ```

3. 先运行 `npm run verify`，记录完整输出；不要先修改代码。
4. 如果需要真实站点验收，启动 Firefox/Edge 并由你本人完成登录和验证码；代理只进行页面扫描、填写和日志观察。
5. 如果需要修改网站端，同时进入同级 `offer-star-web` 仓库，单独查看它的 Git 状态、环境变量和部署流程，两个仓库分别提交。
6. 真实测试完成后，把结果写入 `docs/SITE_REGRESSION_MATRIX.md`，并在提交说明里列出执行过的命令和未完成项。

## 常用命令

```powershell
# 静态和单元门禁
npm run typecheck
npm test -- --run
npm run verify

# 三浏览器构建
npm run build:all
npm run test:firefox

# Edge/Chrome 真实扩展 E2E
$env:CHROME_EXECUTABLE_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e:extension
npm run test:e2e:ai

# Firefox 临时运行时与页面只读检查
npm run test:firefox:runtime
$env:FIREFOX_DEBUG_PORT='9728'
npm run test:firefox:page

# 站点公开入口可达性，不代表已登录或可填写
npm run test:sites:reachability
```

浏览器手工加载路径：

- Chrome：`.output/chrome-mv3`
- Edge：`.output/edge-mv3`
- Firefox：`.output/firefox-mv2/manifest.json`

不要加载历史 `dist/` 目录，也不要把 `.output` 或浏览器 profile 提交到 Git。

## 问题定位顺序

先看浏览器控制台中的 `[Offer Star][Content]`、`[Offer Star][Background]`、`[Offer Star][FloatingPanel]` 和 `[扩展AI]` 日志；然后用脱敏夹具复现；再检查站点 adapter、字段标签推断和页面版本。遇到验证码或 `_security_check` 时记录为安全边界，停止自动化，不尝试绕过。

## Git 工作方式

当前远程为 `origin https://github.com/someone1128/offer-star-extension.git`。开发前执行 `git status --short`，提交前执行 `git diff --cached`、`npm run verify` 和 `git status --short`。提交信息使用中文或清晰的 Conventional Commits 格式，例如：

```text
feat(boss): 增加 BOSS 动态下拉字段适配
fix(firefox): 修复临时 profile 调试端口参数
test(sites): 补充 Moka 脱敏表单夹具
```

不要提交真实简历和任何 API Key。DeepSeek Key 如需配置，只写入网站端本机 `.env.local`，并确认该文件被 Git 忽略。
