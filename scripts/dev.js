import { spawn } from "child_process";
import open from "open";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const build = spawn(npmCmd, ["run", "build:client"], {
  stdio: "inherit",
  shell: true,
});

build.on("close", (code) => {
  if (code !== 0) {
    console.error(`Build failed with exit code ${code}`);
    process.exit(code);
  }

  console.log("Client build complete. Starting server...");

  const server = spawn("npx", ["tsx", "watch", "src/server.ts"], {
    stdio: "inherit",
    shell: true,
  });

  setTimeout(() => {
    console.log("Opening browser...");
    open("http://localhost:3000");
  }, 2000);
});
