import { createReadStream, createWriteStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { pack } from "tar-stream";
import { Readable } from "node:stream";
import lzma from "@napi-rs/lzma";

export async function compressTarXz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  const tarPack = pack();
  
  // Collect tar data in memory
  const chunks: Buffer[] = [];
  tarPack.on('data', (chunk) => chunks.push(chunk));
  
  const tarComplete = new Promise<void>((resolve, reject) => {
    tarPack.on('end', resolve);
    tarPack.on('error', reject);
  });
  
  // Add files to tar
  await addToTar(tarPack, cwd, target);
  tarPack.finalize();
  
  // Wait for tar to finish
  await tarComplete;
  
  // Concatenate all chunks
  const tarBuffer = Buffer.concat(chunks);
  
  // Compress with xz
  const compressedBuffer = await lzma.lzma.compress(tarBuffer);
  
  // Write to file
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(destination);
    const stream = Readable.from(compressedBuffer);
    
    stream.pipe(output);
    
    output.on('finish', resolve);
    output.on('error', reject);
  });
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