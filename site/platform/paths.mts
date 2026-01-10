import * as path from "node:path";
import * as url from "node:url";

const filename = url.fileURLToPath(import.meta.url);
const platform = path.dirname(filename);
const site = path.dirname(platform);
const root = path.dirname(site);
const binariesRoot = path.join(root, "binaries");
const buildRoot = path.join(root, "build");
const tmpRoot = path.join(root, "tmp");
const tmpDownloads = path.join(root, "tmp", "downloads");

/// Factory function that creates a path.join
const $ =
  (...base: string[]): ((...segs: string[]) => string) =>
  (...segs: string[]) =>
    path.normalize(path.join(...base, ...segs));

export const Paths = Object.freeze({
  ["~"]: root,
  ["~/"]: $(root),
  ["~/site"]: site,
  ["~/site/"]: $(site),
  ["~/tmp"]: tmpRoot,
  ["~/tmp/"]: $(tmpRoot),
  ["~/tmp/downloads"]: tmpDownloads,
  ["~/tmp/downloads/"]: $(tmpDownloads),
  ["~/binaries"]: binariesRoot,
  ["~/binaries/"]: $(binariesRoot),
  ["~/build"]: buildRoot,
  ["~/build/"]: $(buildRoot),
});
