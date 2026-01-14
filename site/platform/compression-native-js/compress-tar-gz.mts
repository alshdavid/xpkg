import { createReadStream, createWriteStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { createGzip } from "node:zlib";
import { pack } from "tar-stream";
import { pipeline } from "node:stream/promises";

export async function compressTarGz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  const tarPack = pack();
  const gzip = createGzip();
  const output = createWriteStream(destination);

  // Start pipeline but don't await yet
  const pipelinePromise = pipeline(tarPack, gzip, output);

  // Add all entries and wait for them to complete
  await addToTar(tarPack, cwd, target);

  // Now finalize the pack
  tarPack.finalize();

  // Wait for the pipeline to complete
  await pipelinePromise;
}

async function addToTar(
  tarPack: ReturnType<typeof pack>,
  cwd: string,
  target: string,
): Promise<void> {
  const fullPath = join(cwd, target);
  const stats = await stat(fullPath);

  if (stats.isDirectory()) {
    if (target !== ".") {
      tarPack.entry(
        { name: target + "/", type: "directory", mode: stats.mode },
        "",
      );
    }

    const entries = await readdir(fullPath);

    for (const entry of entries) {
      const entryPath = target === "." ? entry : join(target, entry);
      await addToTar(tarPack, cwd, entryPath);
    }
  } else if (stats.isFile()) {
    await new Promise<void>((resolve, reject) => {
      const fileStream = createReadStream(fullPath);
      const entry = tarPack.entry(
        {
          name: target,
          size: stats.size,
          mode: stats.mode,
          mtime: stats.mtime,
        },
        (error) => {
          if (error) reject(error);
          else resolve();
        },
      );

      fileStream.pipe(entry);

      // Also handle file stream errors
      fileStream.on("error", reject);
    });
  }
}
