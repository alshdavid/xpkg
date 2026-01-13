import * as fs from "node:fs";
import * as path from "node:path";
import { sh } from "./sh.mts";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { createGunzip } from "node:zlib";
import { extract } from "tar-stream";

// export async function wget(url: string, dest: string): Promise<void> {
//   if (!fs.existsSync(path.dirname(dest))) {
//     fs.mkdirSync(path.dirname(dest), { recursive: true });
//   }
//   if (fs.existsSync(dest)) {
//     return;
//   }

//   await sh("wget", [
//     "--progress=bar:force:noscroll",
//     "--trust-server-names",
//     "-O",
//     dest,
//     url,
//   ]);
// }

export async function wget(url: string): Promise<ArrayBuffer> {
  console.log("Downloading:", url);
  const response = await fetch(url, {
    headers: {
      "Accept-Encoding": "identity", // Disable automatic decompression
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download file: ${response.status} ${response.statusText}`,
    );
  }

  return response.arrayBuffer();
  // const arrayBuffer = await response.arrayBuffer();
  // await fs.promises.writeFile(output, Buffer.from(arrayBuffer));
}
