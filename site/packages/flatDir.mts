import type { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "flatdir";

export default async function flatDir(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease(`alshdavid/${PROJECT}`);
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-linux-amd64.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-linux-arm64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-macos-amd64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-macos-arm64.tar.gz`   },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-windows-amd64.tar.gz` },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-windows-arm64.tar.gz` },
  ]
}
