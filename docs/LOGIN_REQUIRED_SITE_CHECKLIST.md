# 真实回归登录清单

以下站点的公开首页可能可以访问，但职位申请、简历信息或投递页面通常需要账号登录。请由用户在 Firefox 中完成登录，再打开具体职位详情或申请页面；插件测试只使用已经打开的页面，不读取密码、验证码或登录凭证。

## 第一批：优先登录

| 优先级 | 站点 | 登录入口 | 登录后建议打开的页面 | 重点验证 |
| --- | --- | --- | --- | --- |
| P0 | BOSS 直聘 | https://www.zhipin.com/ | 任意职位详情页、沟通/投递入口 | 站点识别、职位下拉、通用字段、附件；遇到风控页先完成验证，插件应显示安全验证提示 |
| P0 | Moka 招聘系统 | https://app.mokahr.com/ | 企业专属 `/apply/...` 申请页 | 搜索型城市、动态经历、分步表单、附件 |
| P0 | 北森招聘系统 | https://www.zhiye.com/ | 企业专属职位申请页 | 动态经历、附件、下一步按钮、禁止最终提交 |
| P1 | 智联招聘 | https://www.zhaopin.com/ | 登录后职位申请/简历完善页 | 原生下拉、学历、期望城市、附件 |
| P1 | 前程无忧 | https://www.51job.com/ | 登录后简历中心或职位申请页 | 日期、工作经历、附件、覆盖填写 |
| P1 | 猎聘 | https://www.liepin.com/ | 登录后职位申请页 | 职位上下文、文本域、附件 |
| P1 | 牛客网 | https://www.nowcoder.com/ | 校招职位申请页 | 校园字段、下拉、项目经历 |

## 第二批：招聘平台和实习平台

| 站点 | 登录入口 | 建议页面 |
| --- | --- | --- |
| 拉勾网 | https://www.lagou.com/ | 职位详情或申请页 |
| 实习僧 | https://www.shixiseng.com/ | 实习职位申请页 |
| 应届生求职网 | https://www.yingjiesheng.com/ | 校招职位申请页 |
| 脉脉 | https://maimai.cn/ | 招聘职位或申请入口 |
| 领英 | https://www.linkedin.com/ | Jobs 职位详情或 Easy Apply 页面 |
| 汇博招聘 | https://www.huibo.com/ | 职位申请页 |
| 58 同城招聘 | https://www.58.com/ | 招聘职位申请页 |
| 赶集直招 | https://www.ganji.com/ | 招聘职位申请页 |
| 看准网 | https://www.kanzhun.com/ | 职位申请入口 |
| 鱼泡网 | https://www.yupao.com/ | 招聘职位申请页 |
| 斗米招聘 | https://www.doumi.com/ | 招聘职位申请页 |
| 兼职猫 | https://www.jianzhimao.com/ | 兼职职位申请页 |
| 百姓网招聘 | https://jobs.baixing.com/ | 招聘职位申请页 |

## 第三批：企业校招官网

这些站点通常允许浏览职位，但提交申请、保存简历或查看个人申请状态需要登录。每次只需登录一个站点，然后打开一个具体职位申请页面：

- 字节跳动：https://jobs.bytedance.com/ 或 https://job.bytedance.com/
- 阿里巴巴：https://jobs.alibaba.com/ 或 https://talent.alibaba.com/
- 腾讯：https://join.qq.com/ 或 https://career.tencent.com/
- 百度：https://talent.baidu.com/
- 美团：https://zhaopin.meituan.com/
- 京东：https://campus.jd.com/
- 滴滴：https://jobs.didi.cn/
- 网易：https://career.netease.com/
- 华为：https://career.huawei.com/
- 360：https://campus.360.cn/
- 哔哩哔哩：https://www.bilibili.com/blackboard/join-list.html
- 小红书：https://campus.xiaohongshu.com/
- 蚂蚁集团：https://talent.antgroup.com/
- 快手：https://campus.kuaishou.cn/
- 拼多多：https://careers.pinduoduo.com/
- 小米：https://career.mi.com/
- OPPO：https://careers.oppo.com/
- vivo：https://career.vivo.com/
- 中兴：https://job.zte.com.cn/
- 携程：https://campus.ctrip.com/
- SHEIN：https://careers.shein.com/
- 蔚来：https://www.nio.io/careers/
- 理想汽车：https://www.lixiang.com/employ/
- 小鹏汽车：https://www.xiaopeng.com/join.html
- 比亚迪：https://hr.byd.com.cn/
- 海尔：https://career.haier.com/
- 顺丰：https://careers.sf-express.com/

## 登录后操作约定

1. 用户只负责登录和处理验证码，不能把密码或验证码发送给开发人员。
2. 登录完成后打开具体职位申请页，并保持页面不要切换到其他站点。
3. 告诉开发人员“站点 + 已打开申请页”，例如“BOSS 直聘，已打开职位申请页”。
4. 开发人员只验证扫描、字段映射、填写预览、附件和下一步，不点击投递或最终提交。
5. 测试完成后可退出登录或关闭浏览器；插件不保存账号密码。

### BOSS 直聘当前回归步骤

1. 在 Firefox 保持 BOSS 登录状态，打开一个职位详情页；如果页面地址包含 `_security_check` 或页面显示“安全验证/异常访问”，先由用户完成验证，插件不会尝试绕过。
2. 点击网页右下角悬浮球，确认右侧悬浮面板显示“当前页面：BOSS 直聘”，再点击“扫描当前页面”。
3. 在扫描结果中确认姓名、手机号、邮箱等字段；含敏感问题、照片、附件或低置信度字段时，先进入“查看匹配结果”，不能直接一键填写。
4. 选择“仅填写新增内容”或“全部覆盖重填”，点击“确认填写”，检查页面值变化；插件不会点击“投递”“立即申请”或其他最终提交按钮。
5. 记录扫描字段数、成功/失败字段和脱敏失败原因。若页面发生异步更新，面板应提示“页面表单已更新，请重新扫描”。

通过标准：悬浮面板可打开、BOSS adapter 不回退到通用规则、至少三个字段可识别并成功写入、非法值被拒绝、最终提交按钮未被自动点击。安全验证页只能记录为“安全边界通过”，不能把它当作表单填写通过。

## 当前建议顺序

先测试 BOSS 直聘，再测试 Moka、北森、智联、前程无忧和猎聘。完成这六类后，通用引擎和 ATS 动态控件的覆盖证据会明显增强，再继续企业校招官网批量回归。
