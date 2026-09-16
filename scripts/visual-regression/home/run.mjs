/**
 * Run Home V1 visual checks against an isolated local Next.js dev server.
 * The server is always stopped before this process exits.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";

const host = "127.0.0.1";
const port = Number(process.env.VISUAL_PORT ?? 3100);
const url = `http://${host}:${port}`;
const nextCli = path.resolve("node_modules/next/dist/bin/next");
const scriptDir = path.resolve("scripts/visual-regression/home");

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", env });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${signal ?? `code ${code}`}`));
    });
  });
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "server did not respond";

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = `received HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

async function stop(server) {
  if (server.exitCode !== null || server.signalCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    once(server, "exit"),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode === null && server.signalCode === null) server.kill("SIGKILL");
}

const server = spawn(
  process.execPath,
  [nextCli, "dev", "--hostname", host, "--port", String(port)],
  { stdio: "inherit", env: { ...process.env, NEXT_DIST_DIR: ".next-visual", NEXT_TELEMETRY_DISABLED: "1" } },
);

try {
  await waitForServer();
  const testEnv = { ...process.env, URL: url };
  await run(process.execPath, [path.join(scriptDir, "diff.mjs")], testEnv);
  await run(process.execPath, [path.join(scriptDir, "interactions.mjs")], testEnv);
} finally {
  await stop(server);
}
