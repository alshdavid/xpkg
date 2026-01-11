import * as fs from "node:fs";
import * as path from "node:path";
import { releaseExists } from "../platform/repackage-versions/release-exists.mts";
import { recompress } from "../platform/repackage-versions/recompress.mts";
import {
  inferArchiveFormat,
  sortEntries,
} from "../platform/repackage-versions/infer-format.mts";
import * as packages from "../packages/index.mts";
import { Paths } from "../platform/paths.mts";
import {
  DownloadManifest,
  DownloadManifestEntry,
} from "../platform/download-manifest.mts";
import { REPO } from "../platform/repo-name.mts";

export async function main() {
  if (fs.existsSync(Paths["~/tmp"])) {
    await fs.promises.rm(Paths["~/tmp"], { recursive: true, force: true });
  }
  if (fs.existsSync(Paths["~/binaries"])) {
    await fs.promises.rm(Paths["~/binaries"], { recursive: true, force: true });
  }
  if (fs.existsSync(Paths["~/build"])) {
    await fs.promises.rm(Paths["~/build"], { recursive: true, force: true });
  }
  await fs.promises.mkdir(Paths["~/tmp"], { recursive: true });
  await fs.promises.mkdir(Paths["~/binaries"], { recursive: true });
  await fs.promises.mkdir(Paths["~/build"], { recursive: true });

  const downloadManifest: DownloadManifest = {};
  await Promise.all(
    Object.values(packages).map((mod) => mod.default(downloadManifest)),
  );

  if (!process.argv.includes("--force")) {
    for (const [packageName, _entries] of Object.entries(downloadManifest)) {
      downloadManifest[packageName] = downloadManifest[packageName].filter(
        ({ os, arch }) => {
          if (process.platform === "win32" && os === "windows") {
            return true;
          }

          if (
            process.platform === "linux" &&
            process.arch === "x64" &&
            os === "linux" &&
            arch === "amd64"
          ) {
            return true;
          }

          if (
            process.platform === "linux" &&
            process.arch === "arm64" &&
            os === "linux" &&
            arch === "arm64"
          ) {
            return true;
          }

          if (process.platform === "darwin" && os === "macos") {
            return true;
          }

          return false;
        },
      );
    }
  }

  const downloadManifestEntries: Array<[string, Array<DownloadManifestEntry>]> =
    Object.entries(downloadManifest);
  downloadManifestEntries.sort((a, b) => sortEntries(a[0], b[0]));

  for (const [releaseName, downloads] of downloadManifestEntries) {
    await fs.promises.rm(Paths["~/tmp"], { recursive: true, force: true });
    await fs.promises.mkdir(Paths["~/tmp/downloads"], { recursive: true });

    if (!downloads.length) {
      console.log(`[${releaseName}] SKIP: No downloads`);
      continue;
    }

    console.log(`[${releaseName}] Checking Release Exists`);
    const releaseDoesExist = await releaseExists(REPO, releaseName);
    if (releaseDoesExist) {
      console.log(`[${releaseName}] SKIP: Release Exists`);
      continue;
    }

    if (!fs.existsSync(Paths["~/binaries/"](releaseName))) {
      await fs.promises.mkdir(Paths["~/binaries/"](releaseName), {
        recursive: true,
      });
    }

    await fs.promises.writeFile(
      Paths["~/binaries/"](releaseName, `meta.json`),
      JSON.stringify({
        package: downloads[0].project,
        version: downloads[0].version,
      }),
      "utf8",
    );

    console.log(`\n[${releaseName}] START`);

    const files: Array<{
      project: string;
      version: string;
      os: string;
      arch: string;
      tar_gz: string;
      tar_xz: string;
      zip: string;
    }> = [];

    for (const {
      project,
      version,
      os,
      arch,
      format,
      url: url_original,
      stripComponents,
    } of downloads) {
      let url = url_original;
      if (typeof url === "function") {
        url = await url();
      }

      if (!url) {
        console.log(
          `[${releaseName}] SKIP_DOWNLOAD: ${project}-${version}-${os}-${arch}`,
        );
        continue;
      }

      const success = await recompress(
        Paths["~/binaries"],
        Paths["~/tmp/downloads"],
        Paths["~/binaries/"](`${project}-${version}`),
        url,
        format || inferArchiveFormat(url),
        project,
        `${os}-${arch}`,
        version,
        stripComponents,
      );
      if (!success) {
        console.log(`[${releaseName}] SKIP_DOWNLOAD: ${url}`);
        continue;
      }

      files.push({
        project,
        version,
        os,
        arch,
        tar_gz: path.join(
          Paths["~/binaries"],
          `${project}-${version}-${os}-${arch}.tar.gz`,
        ),
        tar_xz: path.join(
          Paths["~/binaries"],
          `${project}-${version}-${os}-${arch}.tar.xz`,
        ),
        zip: path.join(
          Paths["~/binaries"],
          `${project}-${version}-${os}-${arch}.zip`,
        ),
      });
    }

    if (!files.length) {
      console.log(`[${releaseName}] SKIP_RELEASE: No files`);
      continue;
    }
  }
}

if (process.argv.includes("--run")) {
  main();
}
