/*
  The objective of this script is to generate normalized distributable
  archives of known packages (node, python, etc) and upload them 
  as Github Releases to act as mirrors for the originals.
  
  This is done by;
  - Looking up the latest versions of a project
  - Temporarily downloading & recompress a project to tar.gz, tar.xz and zip
  - Uploading it to a Github Release with the tag being the "$PROJECT_NAME-$PROJECT_VERSION"

*/
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import * as githubApi from "./utils/github.mts";
import type { Arch, ArchiveFormat, Os } from "./utils/types.mts";
import { releaseExists } from "./repackage-versions/release-exists.mts";
import * as nodejsApi from "./utils/nodejs.mts";
import { recompress } from "./repackage-versions/recompress.mts";
import {
  githubReleaseCreate,
  githubReleaseDelete,
  githubReleaseEdit,
  githubReleaseUpload,
} from "./utils/github-releases.mts";
import {
  inferArchiveFormat,
  sortEntries,
} from "./repackage-versions/infer-format.mts";
import { renderEjs } from "./utils/render-ejs.mts";
import * as packages from "./packages/index.mts";
import { Paths } from "./platform/paths.mts";

const REPO = "alshdavid/xpkg";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const root = path.dirname(dirname);
const tmpRoot = path.join(root, "tmp");
const tmpDownloads = path.join(root, "tmp", "downloads");

export type DownloadManifestEntry = {
  project: string;
  version: string;
  format?: ArchiveFormat;
  url: undefined | string | (() => Promise<string | undefined>);
  os: Os;
  arch: Arch;
  stripComponents?: number;
};

export type DownloadManifest = Record<string, Array<DownloadManifestEntry>>;

export async function main() {
  if (fs.existsSync(Paths["~/tmp"])) {
    await fs.promises.rm(Paths["~/tmp"], { recursive: true, force: true });
  }
  if (fs.existsSync(Paths["~/binaries"])) {
    await fs.promises.rm(Paths["~/binaries"], { recursive: true, force: true });
  }
  await fs.promises.mkdir(Paths["~/tmp"], { recursive: true });
  await fs.promises.mkdir(Paths["~/binaries"], { recursive: true });

  const downloadManifest: DownloadManifest = {};
  await Promise.all(
    Object.values(packages).map((mod) => mod.default(downloadManifest)),
  );

  const downloadManifestEntries = Object.entries(downloadManifest);
  downloadManifestEntries.sort((a, b) => sortEntries(a[0], b[0]));

  const doneShellScripts = new Set<string>();

  for (const [releaseName, downloads] of downloadManifestEntries) {
    await fs.promises.rm(tmpRoot, { recursive: true, force: true });
    await fs.promises.mkdir(tmpDownloads, { recursive: true });

    if (!downloads.length) {
      console.log(`[${releaseName}] SKIP: No downloads`);
      continue;
    }

    const packageName = downloads[0]?.project;
    const packageVersion = downloads[0]?.version;

    if (!doneShellScripts.has(packageName)) {
      doneShellScripts.add(packageName);
      await renderEjs({
        inputFile: path.join(dirname, "templates", "install.sh"),
        outputFile: path.join(root, "dist", `${packageName}.sh`),
        packageName,
        PACKAGE_NAME: packageName.toUpperCase().replaceAll("-", "_"),
        package_name: packageName.replaceAll("-", "_"),
      });
    }

    if (await releaseExists(REPO, releaseName)) {
      console.log(`[${releaseName}] SKIP: Release Exists`);
      continue;
    }

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
      let url = url_original
      if (typeof url === 'function') {
        url = await url()
      }

      if (!url) {
        console.log(`[${releaseName}] SKIP_DOWNLOAD: ${url}`);
        continue
      }

      const success = await recompress(
        tmpRoot,
        tmpDownloads,
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
          tmpRoot,
          `${project}-${version}-${os}-${arch}.tar.gz`,
        ),
        tar_xz: path.join(
          tmpRoot,
          `${project}-${version}-${os}-${arch}.tar.xz`,
        ),
        zip: path.join(tmpRoot, `${project}-${version}-${os}-${arch}.zip`),
      });
    }

    if (!files.length) {
      console.log(`[${releaseName}] SKIP_RELEASE: No files`);
      continue;
    }

    try {
      console.log(`[${releaseName}] CREATE_RELEASE`);
      await githubReleaseCreate({
        repo: REPO,
        title: releaseName,
        tag: releaseName,
        draft: true,
        notes: JSON.stringify({
          package: packageName,
          version: packageVersion,
        }),
      });

      for (const { project, version, os, arch, tar_gz, tar_xz, zip } of files) {
        console.log(
          `[${releaseName}] UPLOAD_RELEASE: ${project}-${version}-${os}-${arch}.tar.gz`,
        );
        await githubReleaseUpload({
          repo: REPO,
          tag: releaseName,
          file: tar_gz,
        });

        console.log(
          `[${releaseName}] UPLOAD_RELEASE: ${project}-${version}-${os}-${arch}.tar.xz`,
        );
        await githubReleaseUpload({
          repo: REPO,
          tag: releaseName,
          file: tar_xz,
        });

        console.log(
          `[${releaseName}] UPLOAD_RELEASE: ${project}-${version}-${os}-${arch}.zip`,
        );
        await githubReleaseUpload({
          repo: REPO,
          tag: releaseName,
          file: zip,
        });
      }

      console.log(`[${releaseName}] PUBLISH_RELEASE`);
      await githubReleaseEdit({
        repo: REPO,
        tag: releaseName,
        draft: false,
      });
      console.log(`[${releaseName}] DONE`);
    } catch (error) {
      console.log(`[${releaseName}] ===== FAILED =====`);
      console.log({ error });
      await githubReleaseDelete({
        repo: REPO,
        tag: releaseName,
      });
      process.exit(1);
    }
  }
}

if (process.argv.includes('--run')) {
  main()
}