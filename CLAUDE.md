# Offer Star 浏览器插件项目上下文

更新日期：2026-09-22

这份文件只描述项目上下文、目录职责和恢复入口。可变的任务清单、阶段计划、验收记录和需要用户配合的事项统一维护在 [后续工作与交接清单](docs/后续工作与交接清单.md)，不要把临时任务继续堆到本文件。

仓库地址：<https://github.com/someone1128/offer-star-extension>

## 产品定位

这是 Offer Star 的跨浏览器网页内简历助手，目标浏览器为 Chrome、Edge、Firefox。用户在招聘网站申请页面点击悬浮球，打开右侧悬浮面板，选择简历、扫描字段、确认后填写。插件不自动点击“提交”“投递”“立即申请”，也不绕过验证码或网站风控。AI 只用于字段映射和草稿建议，低置信度结果必须由用户确认。

## 技术和目录

- WXT、React、TypeScript、Vite、Vitest。
- `entrypoints/content.ts` 与 `src/content/`：页面注入、悬浮球、字段扫描、控件填写。
- `src/panel/main.tsx` 与 `src/panel/styles.css`：网页内悬浮 iframe 面板；不使用 Chrome Side Panel 或 Firefox Sidebar。
- `src/background/`：工具栏入口、打开 Offer Star 登录/简历页、缓存、AI 消息。
- `src/shared/`：字段匹配、值校验、站点适配、页面版本、附件、登录状态和安全边界等共享逻辑。
- `tests/`：单元测试、脱敏表单夹具和 Playwright 扩展 E2E。
- `test-pages/`：本地脱敏测试页，不放真实简历或真实账号数据。
- `docs/`：开发验收计划、站点矩阵、登录清单和后续工作。

`offer-star-web` 是同级目录的独立仓库，网站端改动必须在它自己的仓库中提交，不能混入本插件仓库。

## 关键架构约束

1. 通用 HTML 规则优先，站点 adapter 只补充域名、路径和确实特殊的控件。
2. DeepSeek Key 只放在网站端服务端环境变量；插件不保存、不下发、不写入构建产物。
3. 检测到 `_security_check`、验证码或明确风控页面时停止扫描，提示用户人工处理。
4. 照片、附件、协议、敏感问题和低置信度字段需要人工确认。
5. 日志和注释使用中文并脱敏；开发阶段保留 `console.info`、`console.warn`、`console.error`，稳定后再按数据降低日志量。

## 换电脑后的恢复入口

```powershell
git clone https://github.com/someone1128/offer-star-extension.git
cd offer-star-extension
npm ci
npm run verify
```

然后阅读 [后续工作与交接清单](docs/后续工作与交接清单.md)，按其中的 P0 顺序继续。需要真实招聘网站登录、验证码或安全验证时，由用户本人完成；代理只进行授权范围内的页面检查和填写。

## 常用命令

```powershell
npm run typecheck
npm test -- --run
npm run verify
npm run build:all
npm run test:firefox
npm run test:e2e:extension
npm run test:e2e:ai
npm run test:sites:reachability
```

真实 Edge E2E 如需指定 Edge：

```powershell
$env:CHROME_EXECUTABLE_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e:extension
```

构建产物只从以下目录加载：`.output/chrome-mv3`、`.output/edge-mv3`、`.output/firefox-mv2/manifest.json`。不要加载历史 `dist/`，不要提交 `.output`、浏览器 profile、测试截图或日志。

## Git 约定

远程是 `origin https://github.com/someone1128/offer-star-extension.git`。开发前执行 `git status --short`，提交前执行 `git diff --cached` 和 `npm run verify`。提交信息使用 `feat(scope):`、`fix(scope):` 或 `test(scope):`。真实简历、账号信息、API Key 和 `.env*` 不得提交。

