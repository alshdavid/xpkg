import { createReadStream, createWriteStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { pack } from "tar-stream";
import { pipeline } from "node:stream/promises";
import lzma from "lzma-native";

export async function compressTarXz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  const tarPack = pack();
  const compressor = lzma.createCompressor();
  const output = createWriteStream(destination);
  const pipelinePromise = pipeline(tarPack, compressor, output);
  await addToTar(tarPack, cwd, target);
  tarPack.finalize();
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
    });
  }
}
