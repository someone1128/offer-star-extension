/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { createDomEngine } from "../src/content/dom-engine";
import { getSiteAdapter, SITE_ADAPTERS } from "../src/shared/site-adapters";

const fixtures: Array<[string, string, string]> = [
  ["BOSS 直聘", "https://www.zhipin.com/job_detail/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>期望职位<input name="position" /></label>`],
  ["智联招聘", "https://landing.zhaopin.com/apply/1", `<label>真实姓名<input name="realName" /></label><label>邮箱<input name="email" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`],
  ["牛客网", "https://www.nowcoder.com/jobs/detail/1", `<label>姓名<input name="candidate" /></label><label>求职岗位<input name="job" /></label><label>毕业院校<input name="school" /></label>`],
  ["猎聘", "https://www.liepin.com/job/1", `<label>姓名<input name="name" /></label><label>联系电话<input name="phone" /></label><label>工作内容<textarea name="description"></textarea></label>`],
  ["前程无忧", "https://jobs.51job.com/apply/1", `<label>姓名<input name="name" /></label><label>电子邮件<input name="mail" /></label><label>专业<input name="major" /></label>`],
  ["拉勾网", "https://www.lagou.com/jobs/1.html", `<label>姓名<input name="name" /></label><label>居住地<input name="city" /></label><label>职位名称<input name="title" /></label>`],
  ["实习僧", "https://www.shixiseng.com/intern/1", `<label>真实姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学校<input name="school" /></label>`],
  ["应届生求职网", "https://www.yingjiesheng.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>专业<input name="major" /></label>`],
  ["国家大学生就业服务平台", "https://www.guopin.ciicsh.com/job/1", `<label>姓名<input name="name" /></label><label>目标职位<input name="target" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`],
  ["国家大学生就业服务平台新版", "https://gcu.ncss.cn/job/1", `<label>姓名<input name="name" /></label><label>目标职位<input name="target" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`],
  ["职友集", "https://www.jobui.com/job/1", `<label>姓名<input name="name" /></label><label>电话<input name="tel" /></label><label>自我介绍<textarea name="summary"></textarea></label>`],
  ["汇博招聘", "https://www.huibo.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>目标职位<input name="position" /></label>`],
  ["BOSS 直聘校园招聘", "https://campus.zhipin.com/job/1", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>专业<input name="major" /></label>`],
  ["一览英才网", "https://www.job1001.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`],
  ["智通直聘", "https://www.job5156.com/job/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`],
  ["海投网", "https://www.haitou.cc/job/1", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>专业<input name="major" /></label>`],
  ["大街网", "https://m.dajie.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>目标职位<input name="target" /></label>`]
  , ["百度招聘", "https://talent.baidu.com/jobs/detail/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>职位<input name="position" /></label>`]
  , ["美团招聘", "https://zhaopin.meituan.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学校<input name="school" /></label>`]
  , ["京东招聘", "https://campus.jd.com/position/1", `<label>姓名<input name="name" /></label><label>专业<input name="major" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["滴滴招聘", "https://jobs.didi.cn/position/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>目标职位<input name="target" /></label>`]
  , ["网易招聘", "https://career.netease.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>专业<input name="major" /></label>`]
  , ["字节跳动招聘新域名", "https://job.bytedance.com/position/1", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>职位<input name="position" /></label>`]
  , ["阿里巴巴招聘新域名", "https://jobs.alibaba.com/position/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["腾讯招聘新域名", "https://career.tencent.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["哔哩哔哩招聘", "https://www.bilibili.com/blackboard/join-list.html", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["小红书招聘", "https://campus.xiaohongshu.com/campus", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学校<input name="school" /></label>`]
  , ["蚂蚁集团招聘", "https://talent.antgroup.com/campus/home", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["快手招聘", "https://campus.kuaishou.cn/recruit", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>专业<input name="major" /></label>`]
  , ["拼多多招聘", "https://careers.pinduoduo.com/", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学校<input name="school" /></label>`]
  , ["小米招聘", "https://career.mi.com/jobs/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>职位<input name="position" /></label>`]
  , ["OPPO 招聘", "https://careers.oppo.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学校<input name="school" /></label>`]
  , ["vivo 招聘", "https://career.vivo.com/position/1", `<label>姓名<input name="name" /></label><label>专业<input name="major" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["中兴招聘", "https://job.zte.com.cn/position/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>目标职位<input name="target" /></label>`]
  , ["携程招聘", "https://campus.ctrip.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["SHEIN 招聘", "https://careers.shein.com/position/1", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>专业<input name="major" /></label>`]
  , ["蔚来招聘", "https://www.nio.io/careers/jobs", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["理想汽车招聘", "https://www.lixiang.com/employ/campus/list.html", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>目标职位<input name="target" /></label>`]
  , ["小鹏汽车招聘", "https://www.xiaopeng.com/join.html", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>职位<input name="position" /></label>`]
  , ["比亚迪招聘", "https://hr.byd.com.cn/position/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>专业<input name="major" /></label>`]
  , ["海尔招聘", "https://career.haier.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["顺丰招聘", "https://careers.sf-express.com/position/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学校<input name="school" /></label>`]
  , ["北森招聘系统", "https://beisen.zhiye.com/jobs/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["Moka 招聘系统", "https://app.mokahr.com/apply/blueinteractive/38433", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>期望城市<input name="targetCity" /></label>`]
  , ["前程无忧校园招聘", "https://campus.51job.com/demo/position/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["脉脉招聘", "https://maimai.cn/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["领英招聘", "https://www.linkedin.com/jobs/view/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>学校<input name="school" /></label>`]
  , ["中华英才网", "https://www.chinahr.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>专业<input name="major" /></label>`]
  , ["58 同城招聘", "https://jobs.58.com/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>职位<input name="position" /></label>`]
  , ["卓博人才网", "https://www.jobcn.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["赶集直招", "https://zhaopin.ganji.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>职位<input name="position" /></label>`]
  , ["兼职猫", "https://www.jianzhimao.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>兼职职位<input name="position" /></label>`]
  , ["百姓网招聘", "https://jobs.baixing.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>求职职位<input name="position" /></label>`]
  , ["中国人才热线", "https://www.cjrencai.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>专业<input name="major" /></label>`]
  , ["南方人才网", "https://www.job168.com/job/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["就业在线", "https://www.jobonline.cn/jobs/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>目标职位<input name="position" /></label>`]
  , ["中国公共招聘网", "https://job.mohrss.gov.cn/cjobs/jobinfolist/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学历<select name="degree"><option>本科</option><option>硕士</option></select></label>`]
  , ["中国国家人才网", "https://m.newjobs.com.cn/job/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>专业<input name="major" /></label>`]
  , ["高校人才网", "https://www.gaoxiaojob.com/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>学校<input name="school" /></label>`]
  , ["英才网联行业招聘", "https://www.800hr.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>职位<input name="position" /></label>`]
  , ["华为招聘", "https://career.huawei.com/position/1", `<label>姓名<input name="name" /></label><label>学校<input name="school" /></label><label>专业<input name="major" /></label>`]
  , ["360 招聘", "https://campus.360.cn/position/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["看准网", "https://www.kanzhun.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>职位<input name="position" /></label>`]
  , ["鱼泡网", "https://www.yupao.com/job/1", `<label>姓名<input name="name" /></label><label>手机号<input name="phone" /></label><label>城市<input name="city" /></label>`]
  , ["斗米招聘", "https://www.doumi.com/job/1", `<label>姓名<input name="name" /></label><label>电话<input name="phone" /></label><label>期望职位<input name="position" /></label>`]
  , ["伯乐在线", "https://www.boluojob.com/job/1", `<label>姓名<input name="name" /></label><label>邮箱<input name="email" /></label><label>专业<input name="major" /></label>`]
];

describe("主流招聘站点表单夹具", () => {
  it("每个已声明站点都必须有可执行表单夹具，且夹具不能误回退到通用站点", () => {
    const declaredIds = new Set(SITE_ADAPTERS.filter((adapter) => adapter.id !== "generic").map((adapter) => adapter.id));
    const fixtureIds = fixtures.map(([, url]) => getSiteAdapter(url).id);
    const uniqueFixtureIds = new Set(fixtureIds);

    expect(fixtureIds).not.toContain("generic");
    expect(uniqueFixtureIds).toEqual(declaredIds);
  });

  it.each(fixtures)("%s 完成站点识别、扫描和核心字段填写", async (_name, url, html) => {
    document.body.innerHTML = html;
    const adapter = getSiteAdapter(url);
    expect(adapter.id).not.toBe("generic");
    const engine = createDomEngine(document, url);
    const fields = engine.scan();
    expect(fields.length).toBeGreaterThanOrEqual(3);
    expect(fields.every((field) => field.key)).toBe(true);
    const result = await engine.fill({ name: "张三", email: "zhangsan@example.com", phone: "13800000000" }, "overwrite");
    expect(result.filled.length).toBeGreaterThan(0);
    const values = Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")).map((element) => element.value);
    expect(values.some((value) => value === "张三" || value === "zhangsan@example.com" || value === "13800000000")).toBe(true);
  });
});
