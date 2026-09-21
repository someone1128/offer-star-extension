import { defineContentScript } from "wxt/utils/define-content-script";

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  runAt: "document_idle",
  main() {
    void import("../src/content/index");
  }
});
