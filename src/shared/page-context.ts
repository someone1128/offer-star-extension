import { getSiteAdapter } from "./site-adapters";

export type PageContext = {
  siteId: string;
  siteName: string;
  pageUrl: string;
  pageTitle: string;
  jobDescription: string;
};

/** 提取职位页面公开文本，并在交给 AI 前去除常见联系方式。 */
export function extractPageContext(document: Document, pageUrl: string): PageContext {
  const adapter = getSiteAdapter(pageUrl);
  const adapterTitle = adapter.titleSelectors?.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector))).find((node) => node.textContent?.trim())?.textContent;
  const title = adapterTitle
    || document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content
    || document.querySelector("h1")?.textContent
    || document.title;
  const genericSelectors = "[class*='job-description'], [class*='job_detail'], [class*='description'], [class*='responsib'], [class*='requirement'], [data-testid*='description'], article, main";
  const descriptionSelectors = [...(adapter.descriptionSelectors ?? []), genericSelectors].join(",");
  const descriptionNodes = Array.from(document.querySelectorAll<HTMLElement>(descriptionSelectors));
  const text = descriptionNodes.map((node) => node.innerText || node.textContent || "").join("\n");
  return {
    siteId: adapter.id,
    siteName: adapter.name,
    pageUrl: stripQueryAndHash(pageUrl),
    pageTitle: sanitizeText(title).slice(0, 300),
    jobDescription: sanitizeText(text).slice(0, 8000)
  };
}

function stripQueryAndHash(pageUrl: string): string {
  try {
    const parsed = new URL(pageUrl);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return pageUrl;
  }
}

function sanitizeText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[邮箱已脱敏]")
    .replace(/(?:\+?86[-\s]?)?1[3-9]\d{9}/g, "[手机号已脱敏]")
    .replace(/\s+/g, " ")
    .trim();
}
