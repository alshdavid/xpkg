import semver from "semver";
import type { ArchiveFormat } from "../types.mts";

export function inferArchiveFormat(url: string): ArchiveFormat {
  if (url.endsWith(".tar.gz")) {
    return "tar.gz";
  }
  if (url.endsWith(".tar.xz")) {
    return "tar.xz";
  }
  if (url.endsWith(".zip")) {
    return "zip";
  }
  throw new Error(`Cannot infer archive type from url: ${url}`);
}

export function sortEntries(a: string, b: string) {
  try {
    const semverA = tryParseSemver(a);
    const semverB = tryParseSemver(b);

    if (semverA && semverB) {
      return semver.compare(semverA, semverB);
    } else if (semverA) {
      return -1;
    } else if (semverB) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  } catch (e) {
    return a.localeCompare(b);
  }
}

export function tryParseSemver(str: string): semver.SemVer | undefined {
  const result = semver.parse(str);
  if (result) {
    return result;
  }
  const [, version] = str.split("-");
  const result2 = semver.parse(version);
  if (result2) {
    return result2;
  }
  return undefined;
}
