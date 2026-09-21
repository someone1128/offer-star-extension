import { spawn } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const firefoxBinary = process.env.FIREFOX_EXECUTABLE_PATH || "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
const binaryArgument = process.platform === "win32" ? `"${firefoxBinary}"` : firefoxBinary;
// 使用 web-ext 自己创建临时 profile，并关闭标准输入交互，避免复用用户已有 Firefox 进程导致 smoke 卡住。
const child = spawn(command, ["web-ext", "run", "--source-dir", ".output/firefox-mv2", "--firefox-binary", binaryArgument, "--no-reload", "--no-input"], {
  shell: process.platform === "win32",
  stdio: ["ignore", "pipe", "pipe"]
});

let installed = false;
let settled = false;
let output = "";
const finish = (code, message) => {
  if (settled) return;
  settled = true;
  clearTimeout(timer);
  if (code === 0) console.log(message);
  else console.error(message, output.slice(-4000));
  process.exitCode = code;
};

function stopProcessTree() {
  if (!child.pid) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true });
  } else {
    child.kill("SIGINT");
  }
}

const onOutput = (chunk) => {
  output += String(chunk);
  if (!installed && /Installed .* as a temporary add-on/i.test(output)) {
    installed = true;
    stopProcessTree();
    finish(0, "Firefox 运行时 smoke 通过：Firefox 已接受临时扩展并完成安装");
  }
};
child.stdout.on("data", onOutput);
child.stderr.on("data", onOutput);
child.on("error", (error) => finish(1, `Firefox 运行时 smoke 启动失败：${error.message}`));
child.on("close", (code) => {
  if (!installed) finish(1, `Firefox 运行时 smoke 未完成，web-ext 退出码：${code}`);
});

const timer = setTimeout(() => {
  stopProcessTree();
  finish(1, "Firefox 运行时 smoke 超时，未观察到临时扩展安装完成日志");
}, 30_000);
