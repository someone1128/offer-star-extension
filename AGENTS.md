# Offer Star 浏览器插件协作规范

这份文件是给后续 Codex、Claude Code 和其他开发代理使用的项目级说明。它约束开发流程，不替代用户对真实招聘网站的登录、验证码和投递操作授权。

## 项目边界

- 当前 Git 仓库只包含 `offer-star-extension` 浏览器插件；网站端 `offer-star-web` 是同级目录中的独立 Git 仓库，不要把它的改动复制或提交到本仓库。
- 技术栈是 WXT、React、TypeScript、Vite 和 Vitest。网页交互使用右下角悬浮球加网页内悬浮 iframe 面板，不使用 Chrome Side Panel 或 Firefox Sidebar。
- 目标浏览器是 Chrome、Edge、Firefox。浏览器工具栏图标和网页悬浮球应打开同一个网页内面板。
- 通用 HTML 规则优先于站点专用规则；站点 adapter 只描述域名、路径和确实存在的特殊控件。

## 开发规则

1. 开始前先执行 `git status --short`，保留现有改动，不重置、不覆盖用户文件。
2. 代码注释、运行日志、用户可见错误都使用中文；日志必须脱敏，禁止输出 token、API Key、手机号、邮箱、身份证号和完整简历原文。
3. 不绕过招聘网站验证码、登录校验、风控或跨域限制；遇到安全验证页必须停止扫描并提示用户。
4. 不自动点击“提交”“投递”“立即申请”等最终动作；照片、附件、低置信度字段和敏感协议必须经过用户确认。
5. 新增站点必须同时修改 `src/shared/site-adapters.ts`、新增脱敏 HTML 夹具和测试，并更新 `docs/SITE_REGRESSION_MATRIX.md`。
6. 修改面板时同时检查桌面尺寸和 320px 窄屏，不能引入横向滚动条；优先复用内嵌 SVG 图标和现有视觉变量。
7. DeepSeek Key 只能留在 `offer-star-web` 服务端环境变量中。插件端只能调用网站代理接口，禁止把 Key 写入源码、Manifest、构建产物或浏览器存储。

## 验证门禁

在插件目录执行：

```powershell
npm ci
npm run typecheck
npm test -- --run
npm run build:all
npm run test:manifests
npm run test:contracts
npm run test:security
npm run verify
```

真实浏览器验收：

```powershell
$env:CHROME_EXECUTABLE_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e:extension
npm run test:e2e:ai
npm run test:firefox:runtime
```

Firefox 真实登录页面只做用户控制下的手工验证；`npm run test:firefox:page` 是只读检查，不点击、不填写、不读取凭证。自动临时夹具命令为 `npm run test:firefox:fixture`，如果 Windows 进程参数导致失败，应先记录日志并修复脚本，不要跳过 Firefox 验收。

## 完成定义

功能只有在正常路径、异常或安全边界、相关单测、相关构建和真实浏览器证据都具备时才算完成。不能因为 adapter 能识别域名，就声称该网站真实表单已经填写通过。

## 提交规则

提交信息使用 `feat(scope):`、`fix(scope):` 或 `chore(scope):`，说明行为变化。提交前确认没有 `.env*`、真实简历、浏览器 profile、测试截图和构建产物。推送前先查看 `git diff --cached`。

## 继续工作入口

先阅读 [CLAUDE.md](CLAUDE.md) 了解项目上下文，再阅读 [后续工作与交接清单](docs/NEXT_WORK.md) 获取当前任务顺序，最后按 [开发与验收计划](docs/DEVELOPMENT_AND_TEST_PLAN.md) 执行验收。
