import * as fs from "node:fs";
import * as generateIndex from "./generate-package-index.mts";
import { Paths } from "../platform/paths.mts";
import { getRelease } from "../platform/github.mts";
import { REPO } from "../platform/repo-name.mts";
import {
  githubReleaseCreate,
  githubReleaseDelete,
  githubReleaseEdit,
  githubReleaseUpload,
} from "../platform/github-releases.mts";
import { wget } from "../platform/wget.mts";

const latest: Array<string> = ["8zip"];

export async function main() {
  await generateIndex.main()

  let releaseExists = true
  for (const entry of latest) {
    const tagName = `${entry}-latest`

    const manifest: FileManifest = JSON.parse(
      fs.readFileSync(
        Paths["~/dist/"]("packages", entry, "latest.json"),
        "utf8"
      )
    );
    try {
      const current: { version: string } = JSON.parse(
        (await getRelease(REPO, tagName)).body || "{}"
      );
      if (manifest.version === current.version) {
        console.log(`Skipping ${entry}`);
        continue;
      }
    } catch {
      releaseExists = false
    }

    console.log(`Updating ${entry}`);

    if (fs.existsSync(Paths["~/tmp"])) {
      fs.rmSync(Paths["~/tmp"], { recursive: true, force: true })
    }
    fs.mkdirSync(Paths["~/tmp"], { recursive: true })

    const release = await getRelease(REPO, `${entry}-${manifest.version}`)
    for (const asset of release.assets) {
      await wget(asset.browser_download_url, Paths['~/tmp/'](asset.name))
    }
    if (!fs.existsSync(Paths['~/tmp/']('meta.json'))) {
      fs.writeFileSync(JSON.stringify({"package": entry, "version": manifest.version }), Paths['~/tmp/']('meta.json'), 'utf8')
    }

    if (releaseExists) {
      await githubReleaseDelete({
        repo: REPO,
        tag: tagName
      })
    }

    await githubReleaseCreate({
      repo: REPO,
      title: tagName,
      tag: tagName,
      draft: true,
      notes: JSON.stringify({
        package: manifest.package,
        version: manifest.version,
      }),
    })

    for (const fileName of fs.readdirSync(Paths["~/tmp"])) {
      await githubReleaseUpload({
        repo: REPO,
        tag: tagName,
        file: Paths["~/tmp/"](fileName),
      });
    }

    console.log(`[${tagName}] PUBLISH_RELEASE`);
    await githubReleaseEdit({
      repo: REPO,
      tag: tagName,
      draft: false,
    });
  }
}

if (process.argv.includes("--run")) {
  main();
}

type FileManifest = {
  package: string;
  version: string;
  linux_amd64_tar_gz?: string;
  linux_amd64_tar_xz?: string;
  linux_amd64_zip?: string;
  linux_arm64_tar_gz?: string;
  linux_arm64_tar_xz?: string;
  linux_arm64_zip?: string;
  macos_amd64_tar_gz?: string;
  macos_amd64_tar_xz?: string;
  macos_amd64_zip?: string;
  macos_arm64_tar_gz?: string;
  macos_arm64_tar_xz?: string;
  macos_arm64_zip?: string;
  windows_amd64_tar_gz?: string;
  windows_amd64_tar_xz?: string;
  windows_amd64_zip?: string;
  windows_arm64_tar_gz?: string;
  windows_arm64_tar_xz?: string;
  windows_arm64_zip?: string;
};
