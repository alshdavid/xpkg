import * as fs from "node:fs";
import * as path from "node:path";
import { wget } from "../wget.mts";
import type { ArchiveFormat, OsArch } from "../types.mts";
import { extractTarGz } from "../compression-native/extract-tar-gz.mts";
import { extractTarXz } from "../compression-native/extract-tar-xz.mts";
import { extractZip } from "../compression-native/extract-zip.mts";
import { compressTarGz } from "../compression-native/compress-tar-gz.mts";
import { compressTarXz } from "../compression-native/compress-tar-xz.mts";
import { compressZip } from "../compression-native/compress-zip.mts";

export async function recompress(
  tmpRoot: string,
  tmpDownloads: string,
  outDir: string,
  url_original: string,
  format: ArchiveFormat,
  project: string,
  os_arch: OsArch,
  version: string,
  stripComponents?: number,
): Promise<boolean> {
  const inputName = `${project}-${version}-${os_arch}`;
  const inputArchive = `${project}-${version}-${os_arch}.${format}`;

  if (!fs.existsSync(path.dirname(tmpRoot))) {
    await fs.promises.mkdir(path.dirname(tmpRoot), { recursive: true });
  }

  if (!fs.existsSync(outDir)) {
    await fs.promises.mkdir(outDir, { recursive: true });
  }

  if (
    fs.existsSync(path.join(tmpRoot, `${inputName}.tar.xz`)) &&
    fs.existsSync(path.join(tmpRoot, `${inputName}.tar.gz`)) &&
    fs.existsSync(path.join(tmpRoot, `${inputName}.zip`))
  ) {
    console.log(
      `[${project}-${version}-${os_arch}] Already Downloaded, skipping`,
    );
    return false;
  }

  if (format === "bin") {
    await fs.promises.mkdir(path.join(tmpDownloads, inputName), {
      recursive: true,
    });
  }

  let url = url_original;
  let ab: ArrayBuffer | undefined;

  if (url.startsWith("file://")) {
    const local_path = url.replace("file://", "");
    if (!fs.existsSync(local_path)) {
      return false;
    }

    await fs.promises.rename(local_path, path.join(tmpDownloads, inputArchive));
    url = local_path;
    console.log({ url });
  } else {
    if (!(await checkUrlExists(url))) {
      return false;
    }

    ab = await wget(url);
  }

  switch (format) {
    case "tar.gz":
      if (!ab) throw new Error("No Archive");
      await extractTarGz(
        ab,
        path.join(tmpDownloads, inputName),
        stripComponents,
      );
      break;
    case "tar.xz":
      if (!ab) throw new Error("No Archive");
      await extractTarXz(
        ab,
        path.join(tmpDownloads, inputName),
        stripComponents,
      );
      break;
    case "zip":
      if (!ab) throw new Error("No Archive");
      await extractZip(ab, path.join(tmpDownloads, inputName), stripComponents);
      break;
    case "bin":
      await fs.promises.mkdir(path.join(tmpDownloads, inputName), {
        recursive: true,
      });
      if (os_arch.includes("windows")) {
        await fs.promises.cp(
          path.join(tmpDownloads, inputArchive),
          path.join(tmpDownloads, inputName, `${project}.exe`),
        );
      } else {
        await fs.promises.cp(
          path.join(tmpDownloads, inputArchive),
          path.join(tmpDownloads, inputName, project),
        );
      }
      break;
    default:
      throw new Error(`ArchiveFormat not supported: ${format}`);
  }

  await compressTarGz(
    path.join(tmpDownloads, inputName),
    ".",
    path.join(outDir, `${inputName}.tar.gz`),
  );

  await compressTarXz(
    path.join(tmpDownloads, inputName),
    ".",
    path.join(outDir, `${inputName}.tar.xz`),
  );

  await compressZip(
    path.join(tmpDownloads, inputName),
    ".",
    path.join(outDir, `${inputName}.zip`),
  );

  return true;
}

async function checkUrlExists(url: string) {
  try {
    const response = await globalThis.fetch(url, { method: "HEAD" });
    if (response.ok) {
      return true;
    } else {
      console.log(`URL ${url} returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return false;
  }
}
