import { defineConfig } from "wxt";

const e2eAiHostPermission = process.env.OFFER_STAR_E2E_AI === "1" ? ["http://127.0.0.1:4173/*"] : [];

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Offer Star 简历助手",
    description: "使用 Offer Star 简历辅助填写招聘网站表单",
    // 产品主入口是网页内悬浮面板，不申请浏览器原生侧边栏权限。
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: ["https://api.gfjianli.com/*", "https://offer.gfjianli.com/*", ...e2eAiHostPermission],
    action: { default_title: "打开 Offer Star 简历助手" },
    // 网页内悬浮面板通过 iframe 加载，必须显式暴露页面及其打包脚本。
    web_accessible_resources: [{
      resources: ["floating-panel.html", "chunks/*"],
      matches: ["http://*/*", "https://*/*"]
    }],
    browser_specific_settings: {
      gecko: {
        id: "offer-star-extension@example.com",
        data_collection_permissions: { required: ["none"] }
      }
    }
  }
});
