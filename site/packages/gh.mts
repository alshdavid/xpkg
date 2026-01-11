import * as githubApi from "../utils/github.mts";
import { DownloadManifest } from "../build-packages.mts";

const PROJECT = "gh";
const REPO = "cli";
const BASE = `https://github.com/cli/cli/releases/download`;

export default async function gh(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    url: `${BASE}/v${version}/gh_${version}_linux_amd64.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    url: `${BASE}/v${version}/gh_${version}_linux_arm64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64',    url: `${BASE}/v${version}/gh_${version}_macOS_amd64.zip`  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    url: `${BASE}/v${version}/gh_${version}_macOS_arm64.zip`  },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',    url: `${BASE}/v${version}/gh_${version}_windows_amd64.zip` },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64',    url: `${BASE}/v${version}/gh_${version}_windows_arm64.zip` },
  ]
}
