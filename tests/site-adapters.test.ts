import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getSiteAdapter, SITE_ADAPTERS } from "../src/shared/site-adapters";

describe("招聘网站 adapter 识别", () => {
  it.each([
    ["https://www.zhipin.com/job_detail/1", "boss"],
    ["https://landing.zhaopin.com/apply/1", "zhaopin"],
    ["https://www.nowcoder.com/jobs/detail/1", "nowcoder"],
    ["https://www.liepin.com/job/1", "liepin"],
    ["https://jobs.51job.com/apply/1", "51job"],
    ["https://www.lagou.com/jobs/1.html", "lagou"],
    ["https://www.shixiseng.com/intern/1", "shixiseng"],
    ["https://www.yingjiesheng.com/job/1", "yingjiesheng"],
    ["https://www.guopin.ciicsh.com/job/1", "guopin"],
    ["https://gcu.ncss.cn/job/1", "guopin"],
    ["https://www.jobui.com/job/1", "jobui"],
    ["https://www.huibo.com/job/1", "huibo"],
    ["https://campus.zhipin.com/job/1", "zhipin-campus"]
  ])("识别 %s", (url, expected) => {
    expect(getSiteAdapter(url).id).toBe(expected);
  });

  it("未知域名回退到通用 adapter", () => {
    expect(getSiteAdapter("https://example.com/apply").id).toBe("generic");
  });

  it("优先选择更具体的子域名 adapter", () => {
    expect(getSiteAdapter("https://campus.zhipin.com/job/1").id).toBe("zhipin-campus");
  });

  it("第一批站点都配置了职位描述候选选择器", () => {
    for (const url of ["https://zhipin.com", "https://zhaopin.com", "https://nowcoder.com", "https://liepin.com", "https://51job.com", "https://lagou.com", "https://shixiseng.com", "https://yingjiesheng.com", "https://guopin.ciicsh.com", "https://jobui.com", "https://campus.zhipin.com"]) {
      const adapter = getSiteAdapter(url);
      expect(adapter.descriptionSelectors?.length).toBeGreaterThan(0);
      expect(adapter.titleSelectors?.length).toBeGreaterThan(0);
    }
  });

  it("所有已声明的非 generic adapter 都具备完整职位上下文配置", () => {
    const configured = SITE_ADAPTERS.filter((adapter) => adapter.id !== "generic");
    expect(configured.length).toBeGreaterThanOrEqual(50);
    for (const adapter of configured) {
      expect(adapter.hosts.length, `${adapter.id} 缺少 host`).toBeGreaterThan(0);
      expect(adapter.titleSelectors?.length, `${adapter.id} 缺少职位标题选择器`).toBeGreaterThan(0);
      expect(adapter.descriptionSelectors?.length, `${adapter.id} 缺少职位描述选择器`).toBeGreaterThan(0);
    }
  });

  it("适配器 ID 唯一且域名配置保持可匹配格式", () => {
    const ids = SITE_ADAPTERS.map((adapter) => adapter.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const adapter of SITE_ADAPTERS.filter((item) => item.id !== "generic")) {
      for (const host of adapter.hosts) {
        expect(host, `${adapter.id} 的 host 不能包含协议或路径`).toMatch(/^[a-z0-9.-]+$/i);
        expect(host.trim()).toBe(host);
        expect(host).not.toContain("/");
      }
    }
  });

  it("开发计划文档同步当前站点数量和新增站点", () => {
    const configuredCount = SITE_ADAPTERS.filter((adapter) => adapter.id !== "generic").length;
    const plan = readFileSync(new URL("../docs/DEVELOPMENT_AND_TEST_PLAN.md", import.meta.url), "utf8");
    expect(plan).toContain(`当前共有 ${configuredCount} 个非 \`generic\` adapter`);
    expect(plan).toContain("汇博招聘");
  });

  it.each([
    ["https://maimai.cn/job/1", "maimai"],
    ["https://www.linkedin.com/jobs/view/1", "linkedin"],
    ["https://www.chinahr.com/job/1", "chinahr"],
    ["https://jobs.58.com/1", "58"],
    ["https://www.jobcn.com/job/1", "jobcn"],
    ["https://jobs.bytedance.com/position/1", "bytedance-campus"],
    ["https://campus.alibaba.com/position/1", "alibaba-campus"],
    ["https://join.qq.com/position/1", "tencent-campus"],
    ["https://career.huawei.com/position/1", "huawei-campus"],
    ["https://campus.360.cn/position/1", "360-campus"]
  ])("识别扩展站点 %s", (url, id) => {
    expect(getSiteAdapter(url).id).toBe(id);
  });

  it.each([
    ["https://job.bytedance.com/position/1", "bytedance-campus"],
    ["https://jobs.alibaba.com/position/1", "alibaba-campus"],
    ["https://career.tencent.com/position/1", "tencent-campus"],
    ["https://talent.baidu.com/jobs/detail/1", "baidu-campus"],
    ["https://zhaopin.meituan.com/position/1", "meituan-campus"],
    ["https://campus.jd.com/position/1", "jd-campus"],
    ["https://jobs.didi.cn/position/1", "didi-campus"],
    ["https://career.netease.com/position/1", "netease-campus"]
  ])("识别大型企业校招站点 %s", (url, id) => {
    expect(getSiteAdapter(url).id).toBe(id);
    expect(getSiteAdapter(url).descriptionSelectors?.length).toBeGreaterThan(0);
  });

  it.each([
    ["https://www.bilibili.com/blackboard/join-list.html", "bilibili-campus"],
    ["https://campus.xiaohongshu.com/campus", "xiaohongshu-campus"],
    ["https://talent.antgroup.com/campus/home", "antgroup-campus"],
    ["https://campus.kuaishou.cn/recruit", "kuaishou-campus"],
    ["https://careers.pinduoduo.com/", "pinduoduo-campus"]
  ])("识别公开企业招聘入口 %s", (url, id) => {
    expect(getSiteAdapter(url).id).toBe(id);
  });

  it.each([
    ["https://career.mi.com/jobs/1", "xiaomi-campus"],
    ["https://careers.oppo.com/position/1", "oppo-campus"],
    ["https://career.vivo.com/jobs/1", "vivo-campus"],
    ["https://job.zte.com.cn/position/1", "zte-campus"],
    ["https://campus.ctrip.com/position/1", "ctrip-campus"],
    ["https://careers.shein.com/position/1", "shein-campus"],
    ["https://www.nio.io/careers/jobs", "nio-campus"],
    ["https://www.lixiang.com/employ/campus/list.html", "lixiang-campus"],
    ["https://www.xiaopeng.com/join.html", "xpeng-campus"],
    ["https://hr.byd.com.cn/position/1", "byd-campus"],
    ["https://career.haier.com/position/1", "haier-campus"],
    ["https://careers.sf-express.com/position/1", "sf-campus"]
    , ["https://beisen.zhiye.com/", "beisen-ats"]
    , ["https://app.mokahr.com/apply/blueinteractive/38433", "moka-ats"]
    , ["https://campus.51job.com/demo/", "51job-campus"]
  ])("识别新增大型企业招聘入口 %s", (url, id) => {
    expect(getSiteAdapter(url).id).toBe(id);
    expect(getSiteAdapter(url).descriptionSelectors?.length).toBeGreaterThan(0);
  });

  it("主站普通页面不会误识别为哔哩哔哩招聘页", () => {
    expect(getSiteAdapter("https://www.bilibili.com/video/BV1").id).toBe("generic");
  });

  it("Moka 普通产品页不会误识别为申请页", () => {
    expect(getSiteAdapter("https://app.mokahr.com/talent_activation_landing").id).toBe("generic");
  });

  it.each([
    "https://www.nio.io/",
    "https://www.lixiang.com/",
    "https://www.xiaopeng.com/"
  ])("共用主域名的普通页面不会误识别为招聘页 %s", (url) => {
    expect(getSiteAdapter(url).id).toBe("generic");
  });

  it.each([
    ["https://www.job1001.com/job/1", "job1001"],
    ["https://www.job5156.com/job/1", "job5156"],
    ["https://www.haitou.cc/job/1", "haitou"],
    ["https://m.dajie.com/job/1", "dajie"],
    ["https://www.jobonline.cn/jobs/1", "jobonline"],
    ["https://job.mohrss.gov.cn/cjobs/jobinfolist/1", "public-recruitment"],
    ["https://m.newjobs.com.cn/job/1", "china-talent"],
    ["https://www.gaoxiaojob.com/position/1", "gaoxiaojob"],
    ["https://www.800hr.com/job/1", "yingcai-800hr"]
    , ["https://www.kanzhun.com/job/1", "kanzhun"]
    , ["https://www.yupao.com/job/1", "yupao"]
    , ["https://www.doumi.com/job/1", "doumi"]
    , ["https://www.boluojob.com/job/1", "boluojob"]
    , ["https://jobs.baixing.com/job/1", "baixing-jobs"]
  ])("识别新增站点 %s", (url, id) => {
    expect(getSiteAdapter(url).id).toBe(id);
  });

  it("百姓网普通页面不会误识别为招聘页", () => {
    expect(getSiteAdapter("https://www.baixing.com/").id).toBe("generic");
    expect(getSiteAdapter("https://baixing.com/category/1").id).toBe("generic");
  });

  it.each([
    "https://www.hbrc.com.cn/job/1",
    "https://www.sjrc.com.cn/job/1",
    "https://www.nmgrc.com.cn/job/1",
    "https://www.lnjyw.net.cn/job/1",
    "https://www.cnthr.com/job/1",
    "https://www.zjrc.com/job/1",
    "https://www.zjhr.com/job/1",
    "https://www.ahggzp.gov.cn/job/1",
    "https://www.jxrcw.com/job/1",
    "https://www.hxrc.com/job/1"
  ])("识别省级公共招聘平台 %s", (url) => {
    expect(getSiteAdapter(url).id).toBe("public-recruitment");
  });
});
