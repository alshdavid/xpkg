import * as fs from "node:fs";
import { extractTarGz } from "../platform/compression-native/extract-tar-gz.mts";
import { wget } from "../platform/wget.mts";
import { compressTarGz } from "../platform/compression-native/compress-tar-gz.mts";
import { compressZip } from "../platform/compression-native/compress-zip.mts";
import { compressTarXz } from "../platform/compression-native/compress-tar-xz.mts";

export async function main() {
  if (fs.existsSync("/tmp/nodejs")) {
    fs.rmSync("/tmp/nodejs", { recursive: true, force: true });
  }
  fs.mkdirSync("/tmp/nodejs/pkg", { recursive: true });

  const ab = await wget(
    "https://nodejs.org/download/release/v20.20.0/node-v20.20.0-linux-x64.tar.gz",
  );
  await extractTarGz(ab, "/tmp/nodejs/pkg", 1);
  console.log("Compress gz");
  await compressTarGz("/tmp/nodejs/pkg", ".", "/tmp/nodejs/nodejs.tar.gz");
  console.log("Compress xz");
  await compressTarXz("/tmp/nodejs/pkg", ".", "/tmp/nodejs/nodejs.tar.xz");
  console.log("Compress zip");
  await compressZip("/tmp/nodejs/pkg", ".", "/tmp/nodejs/nodejs.zip");
}

if (process.argv.includes("--run")) {
  main();
}
