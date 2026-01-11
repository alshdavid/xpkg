import * as fs from "node:fs";
import * as path from "node:path";
import { commandExists, sh } from "./sh.mts";
import * as sevenzip from "./compression-7zip.mts";

const SEVEN_ZIP_EXISTS = commandExists("7z");

export async function tarGz(folder: string, dest: string): Promise<void> {
  if (SEVEN_ZIP_EXISTS) {
    return sevenzip.tarGz(folder, dest);
  }
  console.log(`[compress:tar.gz] ${dest}`);
  await sh("tar", ["-czf", dest, `.`], {
    stdio: "inherit",
    cwd: folder,
  });
}

export async function untarGz(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  if (SEVEN_ZIP_EXISTS) {
    return sevenzip.untarGz(archive, dest, stripComponents);
  }
  console.log(`[extract] ${archive}`);
  if (path.dirname(archive) !== dest && fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });
  await sh(
    "tar",
    [
      ...(stripComponents ? ["--strip-components", `${stripComponents}`] : []),
      ...["-xzf", archive],
      ...["-C", dest],
    ],
    {
      stdio: "inherit",
    },
  );
}

export async function tarXz(folder: string, dest: string): Promise<void> {
  if (SEVEN_ZIP_EXISTS) {
    return sevenzip.tarXz(folder, dest);
  }
  console.log(`[compress:tar.xz] ${dest}`);
  await sh("tar", ["-cJf", dest, `.`], {
    stdio: "inherit",
    cwd: folder,
  });
}

export async function untarXz(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  console.log(`[extract] ${archive}`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest);
  await sh(
    "tar",
    [
      ...(stripComponents ? ["--strip-components", `${stripComponents}`] : []),
      ...["-xJf", archive],
      ...["-C", dest],
    ],
    {
      stdio: "inherit",
    },
  );
}

export async function zip(folder: string, dest: string): Promise<void> {
  if (SEVEN_ZIP_EXISTS) {
    return sevenzip.zip(folder, dest);
  }
  console.log(`[compress:zip] ${dest}`);
  await sh("zip", ["-q", "-r", dest, `.`], {
    stdio: "inherit",
    cwd: folder,
  });
}

export async function unzip(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  if (SEVEN_ZIP_EXISTS) {
    return sevenzip.unzip(archive, dest, stripComponents);
  }
  console.log(`[extract] ${archive}`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest);
  await sh("unzip", ["-q", archive], {
    stdio: "inherit",
    cwd: dest,
  });
  if (stripComponents) {
    for (const entry of await fs.promises.readdir(dest)) {
      for (const inner of await fs.promises.readdir(path.join(dest, entry))) {
        await fs.promises.rename(
          path.join(dest, entry, inner),
          path.join(dest, inner),
        );
      }
      await fs.promises.rm(path.join(dest, entry), { recursive: true });
    }
  }
}
