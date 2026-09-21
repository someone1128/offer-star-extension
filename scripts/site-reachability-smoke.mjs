import { mkdir, writeFile } from "node:fs/promises";

/**
 * 公开招聘入口只读 smoke。该脚本不登录、不提交表单、不上传文件，
 * 只用于判断网络环境是否能访问站点入口，不能替代真实表单回归。
 */
const targets = [
  ["boss", "https://www.zhipin.com/"],
  ["zhaopin", "https://www.zhaopin.com/"],
  ["51job", "https://jobs.51job.com/"],
  ["liepin", "https://www.liepin.com/"],
  ["lagou", "https://www.lagou.com/"],
  ["nowcoder", "https://www.nowcoder.com/"],
  ["moka", "https://app.mokahr.com/"],
  ["beisen", "https://www.zhiye.com/"],
  ["huibo", "https://www.huibo.com/"],
  ["shixiseng", "https://www.shixiseng.com/"],
  ["yingjiesheng", "https://www.yingjiesheng.com/"],
  ["maimai", "https://maimai.cn/"],
  ["58", "https://www.58.com/"],
  ["ganji", "https://www.ganji.com/"],
  ["jianzhimao", "https://www.jianzhimao.com/"],
  ["baixing-jobs", "https://jobs.baixing.com/"],
  ["yupao", "https://www.yupao.com/"],
  ["doumi", "https://www.doumi.com/"],
  ["boluojob", "https://www.boluojob.com/"],
  ["gaoxiaojob", "https://www.gaoxiaojob.com/"],
  ["haitou", "https://www.haitou.cc/"],
  ["jobui", "https://www.jobui.com/"]
];

const timeoutMs = 8_000;
const strict = process.argv.includes("--strict");

async function checkTarget([id, url]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: { "user-agent": "Offer-Star-Dev-Smoke/0.1" }
    });
    return {
      id,
      url,
      status: response.status,
      location: response.headers.get("location") ?? "",
      reachable: response.status >= 200 && response.status < 400
    };
  } catch (error) {
    return {
      id,
      url,
      reachable: false,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = await Promise.all(targets.map(checkTarget));
await mkdir("test-results", { recursive: true });
await writeFile("test-results/site-reachability.json", `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, "utf8");

for (const result of results) {
  const state = result.reachable ? "可达" : "不可达";
  const detail = result.status ? `HTTP ${result.status}` : result.error;
  console.info(`[Offer Star][SiteSmoke] ${result.id}: ${state}，${detail}`);
}

if (strict && results.some((result) => !result.reachable)) {
  console.error("[Offer Star][SiteSmoke] 严格模式失败：至少一个公开入口不可达");
  process.exitCode = 1;
}
