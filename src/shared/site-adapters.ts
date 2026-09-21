export type SiteAdapter = {
  id: string;
  name: string;
  hosts: string[];
  /** 站点使用主域名承载招聘页时，用路径限制 adapter，避免误识别普通页面。 */
  pathPatterns?: RegExp[];
  titleSelectors?: string[];
  descriptionSelectors?: string[];
};

/** 第一批站点先共用通用填写器，adapter 负责站点识别和后续差异化扩展。 */
export const SITE_ADAPTERS: SiteAdapter[] = [
  { id: "boss", name: "BOSS 直聘", hosts: ["zhipin.com"], titleSelectors: [".job-name", ".job-title"], descriptionSelectors: [".job-sec-text", ".job-detail", ".job-description"] },
  { id: "zhaopin", name: "智联招聘", hosts: ["zhaopin.com"], titleSelectors: [".job-detail-summary__title-text", ".job-card__title-main", ".job-name", ".position-title"], descriptionSelectors: [".job-description__content", ".job-detail", ".job-description"] },
  { id: "nowcoder", name: "牛客网", hosts: ["nowcoder.com"], titleSelectors: [".job-name", ".job-title"], descriptionSelectors: [".job-detail", ".job-description"] },
  { id: "liepin", name: "猎聘", hosts: ["liepin.com"], titleSelectors: [".job-title", ".job-name"], descriptionSelectors: [".job-intro", ".job-description"] },
  { id: "51job", name: "前程无忧", hosts: ["51job.com"], titleSelectors: [".jname", ".joblist-item-jobname", ".jobname", ".cn"], descriptionSelectors: [".job_msg", ".job-description"] },
  { id: "lagou", name: "拉勾网", hosts: ["lagou.com"], titleSelectors: [".职位名称", ".job-name"], descriptionSelectors: [".job-detail", ".job-description"] },
  { id: "shixiseng", name: "实习僧", hosts: ["shixiseng.com"], titleSelectors: [".job-name", ".job-title", "h1"], descriptionSelectors: [".job-detail", ".job-description", ".job-content"] },
  { id: "yingjiesheng", name: "应届生求职网", hosts: ["yingjiesheng.com"], titleSelectors: [".job-title", ".title", "h1"], descriptionSelectors: [".job-detail", ".job-description", ".content"] },
  { id: "guopin", name: "国家大学生就业服务平台", hosts: ["gcu.ncss.cn", "ncss.cn", "guopin.ciicsh.com", "guopin.com"], titleSelectors: [".span-title", ".job-title", ".position-name", "h1"], descriptionSelectors: [".jobdetail-box", ".job-detail", ".job-description", ".detail-content"] },
  { id: "jobui", name: "职友集", hosts: ["jobui.com"], titleSelectors: [".job-name", ".job-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".des"] },
  { id: "huibo", name: "汇博招聘", hosts: ["huibo.com"], titleSelectors: [".job-title", ".job-name", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "zhipin-campus", name: "BOSS 直聘校园招聘", hosts: ["campus.zhipin.com"], titleSelectors: [".job-name", ".job-title", "h1"], descriptionSelectors: [".job-sec-text", ".job-detail", ".job-description"] },
  { id: "maimai", name: "脉脉", hosts: ["maimai.cn"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "linkedin", name: "领英", hosts: ["linkedin.com"], titleSelectors: [".top-card-layout__title", ".job-details-jobs-unified-top-card__job-title", "h1"], descriptionSelectors: [".description__text", ".show-more-less-html__markup", "article"] },
  { id: "chinahr", name: "中华英才网", hosts: ["chinahr.com"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content"] },
  { id: "58", name: "58 同城招聘", hosts: ["58.com"], titleSelectors: [".job_name", ".job-title", "h1"], descriptionSelectors: [".job_desc", ".job-detail", ".description"] },
  { id: "jobcn", name: "卓博人才网", hosts: ["jobcn.com"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content"] },
  { id: "ganji", name: "赶集直招", hosts: ["ganji.com"], titleSelectors: [".job-title", ".job-name", ".pos-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", ".detail"] },
  { id: "jianzhimao", name: "兼职猫", hosts: ["jianzhimao.com"], titleSelectors: [".job-title", ".job-name", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", ".detail", "article"] },
  { id: "baixing-jobs", name: "百姓网招聘", hosts: ["jobs.baixing.com"], titleSelectors: [".job-title", ".job-name", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", ".detail", "article"] },
  { id: "cjrencai", name: "中国人才热线", hosts: ["cjrencai.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "job168", name: "南方人才网", hosts: ["job168.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "jobonline", name: "就业在线", hosts: ["jobonline.cn"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "public-recruitment", name: "公共招聘与省级人才平台", hosts: ["job.mohrss.gov.cn", "hbrc.com.cn", "sjrc.com.cn", "nmgrc.com.cn", "lnjyw.net.cn", "cnthr.com", "zjrc.com", "zjhr.com", "ahggzp.gov.cn", "jxrcw.com", "hxrc.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "china-talent", name: "中国国家人才网", hosts: ["newjobs.com.cn"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "gaoxiaojob", name: "高校人才网", hosts: ["gaoxiaojob.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "yingcai-800hr", name: "英才网联行业招聘", hosts: ["800hr.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content", "article"] },
  { id: "bytedance-campus", name: "字节跳动招聘", hosts: ["jobs.bytedance.com", "job.bytedance.com", "campus.bytedance.com"], titleSelectors: ["[data-testid='job-title']", ".job-title", ".position-title", "h1"], descriptionSelectors: ["[data-testid='job-description']", ".job-detail", ".job-description", "article"] },
  { id: "alibaba-campus", name: "阿里巴巴招聘", hosts: ["campus.alibaba.com", "talent.alibaba.com", "jobs.alibaba.com", "job.alibaba.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "tencent-campus", name: "腾讯招聘", hosts: ["campus.tencent.com", "join.qq.com", "join.tencent.com", "career.tencent.com", "hr.tencent.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "baidu-campus", name: "百度招聘", hosts: ["campus.baidu.com", "talent.baidu.com", "career.baidu.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "meituan-campus", name: "美团招聘", hosts: ["campus.meituan.com", "zhaopin.meituan.com", "jobs.meituan.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "jd-campus", name: "京东招聘", hosts: ["campus.jd.com", "zhaopin.jd.com", "jobs.jd.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "didi-campus", name: "滴滴招聘", hosts: ["campus.didi.cn", "jobs.didi.cn", "zhaopin.didi.cn"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "netease-campus", name: "网易招聘", hosts: ["campus.netease.com", "career.netease.com", "hr.163.com"], titleSelectors: [".job-title", ".position-name", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "huawei-campus", name: "华为招聘", hosts: ["career.huawei.com", "huaweicloud.com"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "360-campus", name: "360 招聘", hosts: ["campus.360.cn"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "job1001", name: "一览英才网", hosts: ["job1001.com", "yl1001.com"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-info"] },
  { id: "job5156", name: "智通直聘", hosts: ["job5156.com"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content"] },
  { id: "haitou", name: "海投网", hosts: ["haitou.cc"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".content"] },
  { id: "dajie", name: "大街网", hosts: ["dajie.com"], titleSelectors: [".job-title", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "bilibili-campus", name: "哔哩哔哩招聘", hosts: ["bilibili.com"], pathPatterns: [/^\/blackboard\//i], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "xiaohongshu-campus", name: "小红书招聘", hosts: ["job.xiaohongshu.com", "campus.xiaohongshu.com"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "antgroup-campus", name: "蚂蚁集团招聘", hosts: ["talent.antgroup.com", "campus.antgroup.com"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "kuaishou-campus", name: "快手招聘", hosts: ["campus.kuaishou.cn", "zhaopin.kuaishou.cn"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "pinduoduo-campus", name: "拼多多招聘", hosts: ["careers.pinduoduo.com"], titleSelectors: [".job-title", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", "article"] },
  { id: "xiaomi-campus", name: "小米招聘", hosts: ["career.mi.com", "hr.xiaomi.com", "campus.mi.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "oppo-campus", name: "OPPO 招聘", hosts: ["careers.oppo.com", "jobs.oppo.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "vivo-campus", name: "vivo 招聘", hosts: ["career.vivo.com", "hr.vivo.com", "campus.vivo.com.cn"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "zte-campus", name: "中兴招聘", hosts: ["job.zte.com.cn", "jobs.zte.com.cn", "campus.zte.com.cn"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "ctrip-campus", name: "携程招聘", hosts: ["campus.ctrip.com", "pages.ctrip.com", "career.ctrip.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "shein-campus", name: "SHEIN 招聘", hosts: ["careers.shein.com", "jobs.shein.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "nio-campus", name: "蔚来招聘", hosts: ["campus.nio.com", "nio.io"], pathPatterns: [/^\/careers(?:\/|$)/i], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "lixiang-campus", name: "理想汽车招聘", hosts: ["lixiang.com"], pathPatterns: [/^\/employ(?:\/|$)/i], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "xpeng-campus", name: "小鹏汽车招聘", hosts: ["xiaopeng.com"], pathPatterns: [/^\/join(?:\.html)?(?:\/|$)/i], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "byd-campus", name: "比亚迪招聘", hosts: ["hr.byd.com.cn", "job.byd.com.cn", "campus.byd.com.cn"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "haier-campus", name: "海尔招聘", hosts: ["career.haier.com", "jobs.haier.com", "campus.haier.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "sf-campus", name: "顺丰招聘", hosts: ["careers.sf-express.com", "jobs.sf-express.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "beisen-ats", name: "北森招聘系统", hosts: ["zhiye.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "moka-ats", name: "Moka 招聘系统", hosts: ["app.mokahr.com"], pathPatterns: [/^\/apply(?:\/|$)/i], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "51job-campus", name: "前程无忧校园招聘", hosts: ["campus.51job.com", "xy.51job.com", "xyz.51job.com"], titleSelectors: [".job-title", ".position-title", ".job-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "kanzhun", name: "看准网", hosts: ["kanzhun.com"], titleSelectors: [".job-title", ".job-name", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "yupao", name: "鱼泡网", hosts: ["yupao.com"], titleSelectors: [".job-title", ".job-name", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "doumi", name: "斗米招聘", hosts: ["doumi.com"], titleSelectors: [".job-title", ".job-name", ".position-name", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "boluojob", name: "伯乐在线", hosts: ["boluojob.com"], titleSelectors: [".job-title", ".job-name", ".position-title", "h1"], descriptionSelectors: [".job-description", ".job-detail", ".job-content", "article"] },
  { id: "generic", name: "通用网申页面", hosts: [] }
];

export function getSiteAdapter(url: string): SiteAdapter {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const matched = SITE_ADAPTERS
      .flatMap((adapter) => adapter.hosts.map((host) => ({ adapter, host })))
      .filter(({ adapter, host }) => {
        if (!(hostname === host || hostname.endsWith(`.${host}`))) return false;
        return !adapter.pathPatterns?.length || adapter.pathPatterns.some((pattern) => pattern.test(new URL(url).pathname));
      })
      .sort((left, right) => right.host.length - left.host.length);
    return matched[0]?.adapter ?? SITE_ADAPTERS[SITE_ADAPTERS.length - 1];
  } catch {
    return SITE_ADAPTERS[SITE_ADAPTERS.length - 1];
  }
}
