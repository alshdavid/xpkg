import * as fs from "node:fs";
import * as generateIndex from "./generate-package-index.mts";
import { Paths } from "../platform/paths.mts";
import { getRelease, type GithubReleaseResponse } from "../platform/github.mts";
import { REPO } from "../platform/repo-name.mts";
import {
  githubReleaseCreate,
  githubReleaseDelete,
  githubReleaseEdit,
  githubReleaseUpload,
  githubReleaseView,
} from "../platform/github-releases.mts";
import { wget } from "../platform/wget.mts";
import { getLatestNodejsLTS } from "../platform/nodejs.mts";

const latest: Array<string> = [
  "8zip",
  "deno",
  "eza",
  "flatdir",
  "fnm",
  "gh",
  "go",
  "http-server-rs",
  "hyperfine",
  "just",
  "nodejs", // mismatched names
  "oha",
  "rrm",
  "terraform",
  "vultr-cli",
  "zenith",
];

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
      const { body: current} = await githubReleaseView<{ version: string }>({
        repo: REPO,
        tag: tagName
      })
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
      await wget(asset.browser_download_url, Paths['~/tmp/'](asset.name.replace(`-${manifest.version}-`, '-')))
    }
    if (!fs.existsSync(Paths['~/tmp/']('meta.json'))) {
      fs.writeFileSync(JSON.stringify({"package": entry, "version": manifest.version }), Paths['~/tmp/']('meta.json'), 'utf8')
    }

    if (releaseExists) {
      console.log(`[${tagName}] RELEASE EXISTS, DELETING`)
      await githubReleaseDelete({
        repo: REPO,
        tag: tagName
      })
    }

    console.log(`[${tagName}] CREATING LATEST`)
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
      console.log(`[${tagName}] UPLOADING: ${fileName}`)
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


  console.log(`LTS Packages`);

  /// Custom LTS handling
  const ltsMainfest: Array<[string, string]> = [
    ["nodejs", await getLatestNodejsLTS()]
  ];

  console.table(ltsMainfest)

  for (const [entry, version] of ltsMainfest) {
    const tagName = `${entry}-lts`

    let releaseExists = false
    try {
      const { body: ltsRelease } = await githubReleaseView<{ version: string }>({
        repo: REPO,
        tag: tagName
      })
      if (ltsRelease?.version === version) {
        console.log(`Skipping, LTS already current ${entry}-${version}`);
        continue
      }
      releaseExists = true
    } catch {
      // Doesn't matter if it doesn't exist, we'll create it
    }

    let release: GithubReleaseResponse
    try {
      release = await getRelease(REPO, `${entry}-${version}`)
    } catch {
      console.log(`ERROR, ${entry} ${version} release not found, skipping`)
      continue
    }

    if (fs.existsSync(Paths["~/tmp"])) {
      fs.rmSync(Paths["~/tmp"], { recursive: true, force: true })
    }
    fs.mkdirSync(Paths["~/tmp"], { recursive: true })

    for (const asset of release.assets) {
      await wget(asset.browser_download_url, Paths['~/tmp/'](asset.name.replace(`-${version}-`, '-')))
    }
    if (!fs.existsSync(Paths['~/tmp/']('meta.json'))) {
      fs.writeFileSync(JSON.stringify({"package": entry, "version": version }), Paths['~/tmp/']('meta.json'), 'utf8')
    }

    if (releaseExists) {
      console.log(`[${tagName}] RELEASE EXISTS, DELETING`)
      await githubReleaseDelete({
        repo: REPO,
        tag: tagName
      })
    }

    console.log(`[${tagName}] CREATING LATEST`)
    await githubReleaseCreate({
      repo: REPO,
      title: tagName,
      tag: tagName,
      draft: true,
      notes: JSON.stringify({
        package: entry,
        version: version,
      }),
    })

    for (const fileName of fs.readdirSync(Paths["~/tmp"])) {
      console.log(`[${tagName}] UPLOADING: ${fileName}`)
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
