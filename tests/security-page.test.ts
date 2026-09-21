/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { detectSecurityChallenge } from "../src/shared/security-page";

describe("招聘网站安全验证页识别", () => {
  it("识别 BOSS 的 security_check 地址", () => {
    document.title = "BOSS 直聘";
    document.body.innerHTML = "<main>请完成验证后继续访问</main>";
    expect(detectSecurityChallenge(document, "https://www.zhipin.com/web/geek/jobs?_security_check=1")).toContain("安全验证");
  });

  it("识别页面文本中的异常访问提示", () => {
    document.title = "安全校验";
    document.body.innerHTML = "<main>当前 IP 地址可能存在异常访问行为</main>";
    expect(detectSecurityChallenge(document, "https://www.zhipin.com/web/geek/jobs")).toBe("检测到网站安全验证页面，请在招聘网站中完成验证后再扫描");
  });

  it("普通职位页不会误判为安全验证页", () => {
    document.title = "前端开发工程师招聘";
    document.body.innerHTML = "<main>岗位职责和任职要求</main>";
    expect(detectSecurityChallenge(document, "https://www.zhipin.com/job_detail/1")).toBeNull();
  });

  it("BOSS 登录后的职位列表页不会误判为安全验证页", () => {
    document.title = "漳州招聘 - BOSS 直聘";
    document.body.innerHTML = "<main><h1>漳州招聘</h1><p>推荐职位</p><a href=\"/job_detail/1\">前端开发工程师</a></main>";
    expect(detectSecurityChallenge(document, "https://www.zhipin.com/web/geek/jobs")).toBeNull();
  });
});
