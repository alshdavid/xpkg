import { mkdir } from "node:fs/promises";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { createGunzip } from "node:zlib";
import { extract } from "tar-stream";

export async function extractTarGz(
  buffer: ArrayBuffer,
  destination: string,
  stripComponents?: number,
): Promise<void> {
  const nodeBuffer = Buffer.from(buffer);
  const bufferStream = Readable.from(nodeBuffer);
  const gunzip = createGunzip();

  const tarExtract = extract();

  tarExtract.on("entry", async (header, stream, next) => {
    try {
      let entryPath = header.name;

      if (stripComponents && stripComponents > 0) {
        const parts = entryPath.split("/");

        if (parts.length <= stripComponents) {
          stream.resume();
          next();
          return;
        }

        entryPath = parts.slice(stripComponents).join("/");

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
    bufferStream.pipe(gunzip).pipe(tarExtract);
  });
}
