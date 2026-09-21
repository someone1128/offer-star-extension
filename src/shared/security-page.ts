/** 识别招聘网站的安全验证页，提示用户完成验证后再扫描，不尝试绕过站点风控。 */
export function detectSecurityChallenge(document: Document, pageUrl: string): string | null {
  let url: URL | null = null;
  try { url = new URL(pageUrl); } catch { /* 页面地址可能来自测试夹具，继续使用页面文本判断 */ }
  const urlText = `${url?.pathname ?? ""} ${url?.search ?? ""}`.toLowerCase();
  if (/_security_check|security[_-]?check|captcha|verify/.test(urlText)) {
    return "当前页面需要完成网站安全验证，请在招聘网站中完成验证后再扫描";
  }
  const title = document.title.trim();
  const text = (document.body?.innerText ?? "").slice(0, 6_000);
  if (/(安全验证|安全校验|异常访问|访问异常|验证访问|请完成验证|验证码)/i.test(`${title}\n${text}`)) {
    return "检测到网站安全验证页面，请在招聘网站中完成验证后再扫描";
  }
  return null;
}
