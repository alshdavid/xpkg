import { createReadStream, createWriteStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { pack } from "tar-stream";
import { Readable } from "node:stream";
import { compress } from "@napi-rs/lzma/xz";

export async function compressTarXz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  const tarPack = pack();

  // Collect tar data in memory
  const chunks: Buffer[] = [];
  tarPack.on("data", (chunk) => chunks.push(chunk));

  const tarComplete = new Promise<void>((resolve, reject) => {
    tarPack.on("end", resolve);
    tarPack.on("error", reject);
  });

  await addToTar(tarPack, cwd, target);
  tarPack.finalize();
  await tarComplete;

  // Concatenate all chunks
  const tarBuffer = Buffer.concat(chunks);
  console.log(`Tar buffer size: ${tarBuffer.length} bytes`);

  // Compress with XZ (LZMA2 format)
  const compressedBuffer = await compress(tarBuffer);

  console.log(`Compressed buffer size: ${compressedBuffer.length} bytes`);
  console.log(
    `First 10 bytes (hex): ${compressedBuffer.slice(0, 10).toString("hex")}`,
  );

  // XZ files should start with: FD 37 7A 58 5A 00
  if (compressedBuffer[0] === 0xfd && compressedBuffer[1] === 0x37) {
    console.log("✓ File appears to be XZ compressed");
  } else {
    console.log("✗ File does NOT appear to be XZ compressed");
  }

  // Write to file
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(destination);
    const stream = Readable.from(compressedBuffer);

    stream.pipe(output);

    output.on("finish", () => {
      console.log(`Written to ${destination}`);
      resolve();
    });
    output.on("error", reject);
    stream.on("error", reject);
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
        },
      );

      fileStream.pipe(entry);

      entry.on("finish", resolve);
      entry.on("error", reject);
      fileStream.on("error", reject);
    });
  }
}
