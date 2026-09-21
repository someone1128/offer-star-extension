import { defineConfig } from "vite";

export default defineConfig({
  root: "test-pages",
  server: { host: "127.0.0.1", port: 4173 },
  plugins: [{
    name: "offer-star-e2e-ai-gateway",
    configureServer(server) {
      server.middlewares.use("/api/mock-ai", (_request, response) => {
        response.statusCode = 200;
        response.setHeader("content-type", "application/json");
      setTimeout(() => response.end(JSON.stringify({
        mappings: [],
        drafts: [{ fieldKey: "description", content: "建议候选文案", reason: "本地测试网关返回" }]
      })), 120);
      });
    }
  }]
});
