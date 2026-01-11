import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../utils/github.mts";
import type { Arch, Os } from "../utils/types.mts";

export default async function python(
  manifest: DownloadManifest,
): Promise<void> {
  const project = "python";
  const resp = await githubApi.getRelease("astral-sh/python-build-standalone");

  for (const asset of resp.assets) {
    if (!asset.name.includes("x86_64-") && !asset.name.includes("aarch64")) {
      continue;
    }
    if (
      !asset.name.includes("linux-gnu-install_only_stripped") &&
      !asset.name.includes("windows-msvc-install_only_stripped") &&
      !asset.name.includes("darwin-install_only_stripped")
    ) {
      continue;
    }

    const segs = asset.name.split("-");
    const [major, minor, patch] = segs[1].split("+")[0].split(".");
    const arch = (
      {
        x86_64: "amd64",
        aarch64: "arm64",
      } as Record<string, Arch>
    )[segs[2]];
    const os = (
      {
        darwin: "macos",
        windows: "windows",
        linux: "linux",
      } as Record<string, Os>
    )[segs[4]];
    if (!arch || !os) {
      continue;
    }

    const key = `${project}-${major}.${minor}.${patch}`;
    const version = `${major}.${minor}.${patch}`;

    manifest[key] = manifest[key] || [];
    manifest[key].push({
      project,
      version,
      os,
      arch,
      url: asset.browser_download_url,
      stripComponents: 1,
    });
  }
}
