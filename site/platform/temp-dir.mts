import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function createAutoCleanupTempDir(
  prefix: string = `xpkg-${(Math.random() * 100000).toFixed(0)}`,
) {
  const tempDir = mkdtempSync(join(tmpdir(), prefix));

  const cleanup = () => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore errors during cleanup
    }
  };

  // Register cleanup on various exit scenarios
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("uncaughtException", cleanup);

  return tempDir;
}
