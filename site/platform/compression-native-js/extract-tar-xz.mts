import { mkdir } from "node:fs/promises";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { extract } from "tar-stream";
import { lzma } from "@napi-rs/lzma";

export async function extractTarXz(
  buffer: ArrayBuffer,
  destination: string,
  stripComponents?: number,
): Promise<void> {
  const nodeBuffer = Buffer.from(buffer);

  // Decompress xz to get tar data
  const tarBuffer = await lzma.decompress(nodeBuffer);

  // Create tar extract stream from decompressed data
  const bufferStream = Readable.from(tarBuffer);
  const tarExtract = extract();

  tarExtract.on("entry", async (header, stream, next) => {
    try {
      // Strip components from the path
      let entryPath = header.name;

      if (stripComponents && stripComponents > 0) {
        const parts = entryPath.split("/");

        // If stripping more components than available, skip this entry
        if (parts.length <= stripComponents) {
          stream.resume();
          next();
          return;
        }

        // Remove the first N components
        entryPath = parts.slice(stripComponents).join("/");

        // Skip if the result is empty (was a directory at strip level)
        if (!entryPath) {
          stream.resume();
          next();
          return;
        }
      }

      const filePath = join(destination, entryPath);

      if (header.type === "directory") {
        await mkdir(filePath, { recursive: true });
        stream.resume();
        next();
      } else if (header.type === "file") {
        await mkdir(dirname(filePath), { recursive: true });
        const writeStream = createWriteStream(filePath, {
          mode: header.mode,
        });

        stream.pipe(writeStream);

        writeStream.on("finish", next);
        writeStream.on("error", next);
      } else {
        // Skip other types (symlinks, etc.)
        stream.resume();
        next();
      }
    } catch (error) {
      next(error as Error);
    }
  });

  await new Promise<void>((resolve, reject) => {
    tarExtract.on("finish", resolve);
    tarExtract.on("error", reject);

    bufferStream.pipe(tarExtract);
  });
}
