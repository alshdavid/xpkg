import fs from "node:fs";
import path from "node:path";
import { createAutoCleanupTempDir } from "../temp-dir.mts";
import { archiveUtil } from "./archive-util.mts";

export async function extractTarXz(
  buffer: ArrayBuffer | string,
  destination: string,
  stripComponents?: number,
): Promise<void> {
  if (typeof buffer === "string") {
    await archiveUtil(
      "decompress-tar-xz",
      "--output",
      destination,
      ...(stripComponents ? ["--strip-components", `${stripComponents}`] : []),
      buffer,
    );
    return;
  }
  const tempDir = createAutoCleanupTempDir();
  try {
    const target = path.join(tempDir, "archive.tar.xz");
    fs.promises.writeFile(target, Buffer.from(buffer));

    await archiveUtil(
      "decompress-tar-xz",
      "--output",
      destination,
      ...(stripComponents ? ["--strip-components", `${stripComponents}`] : []),
      target,
    );
  } catch (error) {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }

    throw error;
  }
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
}
