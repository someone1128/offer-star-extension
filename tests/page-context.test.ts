/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { extractPageContext } from "../src/shared/page-context";

describe("职位页面上下文提取", () => {
  it("提取岗位标题和职责文本，并脱敏联系方式", () => {
    document.title = "产品经理 - 测试公司";
    document.body.innerHTML = `
      <h1>高级产品经理</h1>
      <section class="job-description">负责用户增长，联系 hr@example.com，电话 13812345678</section>
    `;
    const context = extractPageContext(document, "https://www.zhipin.com/job/1");
    expect(context.siteId).toBe("boss");
    expect(context.pageUrl).toBe("https://www.zhipin.com/job/1");
    expect(context.pageTitle).toBe("高级产品经理");
    expect(context.jobDescription).toContain("负责用户增长");
    expect(context.jobDescription).not.toContain("hr@example.com");
    expect(context.jobDescription).not.toContain("13812345678");
  });

  it("使用实习僧 adapter 的站点选择器提取职位内容", () => {
    document.title = "实习职位";
    document.body.innerHTML = `
      <h1 class="job-title">数据分析实习生</h1>
      <div class="job-content">负责数据报表和分析</div>
    `;
    const context = extractPageContext(document, "https://www.shixiseng.com/intern/1");
    expect(context.siteId).toBe("shixiseng");
    expect(context.pageTitle).toBe("数据分析实习生");
    expect(context.jobDescription).toContain("负责数据报表和分析");
  });

  it("使用国家大学生就业服务平台真实详情页结构提取标题和职位详情", () => {
    document.title = "职位详情";
    document.body.innerHTML = `
      <span class="span-title">产品方案设计</span>
      <div class="details"><p class="title">职位详情</p><div class="jobdetail-box">负责产品方案设计和需求分析，联系 hr@example.com</div></div>
    `;
    const context = extractPageContext(document, "https://gcu.ncss.cn/student/jobs/1/detail.html");
    expect(context.siteId).toBe("guopin");
    expect(context.pageTitle).toBe("产品方案设计");
    expect(context.jobDescription).toContain("负责产品方案设计");
    expect(context.jobDescription).not.toContain("hr@example.com");
  });

  it("使用智联招聘真实职位卡片结构提取标题和职位描述", () => {
    document.title = "智联职位详情";
    document.body.innerHTML = `
      <span class="job-detail-summary__title-text">前端开发工程师</span>
      <div class="job-description"><div class="job-description__content">负责前端页面开发，联系 hr@example.com</div></div>
    `;
    const context = extractPageContext(document, "https://www.zhaopin.com/jobs/1");
    expect(context.siteId).toBe("zhaopin");
    expect(context.pageTitle).toBe("前端开发工程师");
    expect(context.jobDescription).toContain("负责前端页面开发");
    expect(context.jobDescription).not.toContain("hr@example.com");
  });

  it("使用前程无忧真实职位列表结构提取职位标题", () => {
    document.title = "前程无忧职位搜索";
    document.body.innerHTML = `
      <div class="joblist-item-jobname"><div class="job-info"><span class="jname">产品经理</span></div></div>
      <div class="job_msg">负责产品规划和需求分析</div>
    `;
    const context = extractPageContext(document, "https://we.51job.com/pc/search");
    expect(context.siteId).toBe("51job");
    expect(context.pageTitle).toBe("产品经理");
    expect(context.jobDescription).toContain("负责产品规划");
  });

  it.each([
    ["maimai", "https://maimai.cn/job/1"],
    ["linkedin", "https://www.linkedin.com/jobs/view/1"],
    ["chinahr", "https://www.chinahr.com/job/1"],
    ["58", "https://jobs.58.com/1"],
    ["jobcn", "https://www.jobcn.com/job/1"],
    ["bytedance-campus", "https://jobs.bytedance.com/position/1"],
    ["alibaba-campus", "https://campus.alibaba.com/position/1"],
    ["tencent-campus", "https://join.qq.com/position/1"],
    ["huawei-campus", "https://career.huawei.com/position/1"],
    ["360-campus", "https://campus.360.cn/position/1"]
  ])("扩展站点 %s 可以提取职位上下文", (siteId, url) => {
    document.title = "职位页面标题";
    document.body.innerHTML = `<h1>前端工程师</h1><article class="job-description">负责前端开发和团队协作</article>`;
    const context = extractPageContext(document, url);
    expect(context.siteId).toBe(siteId);
    expect(context.pageTitle).toBe("前端工程师");
    expect(context.jobDescription).toContain("负责前端开发");
  });
});
