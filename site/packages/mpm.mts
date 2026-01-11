import type { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "mpm";

export default async function mpm(manifest: DownloadManifest): Promise<void> {
  const resp = await githubApi.getRelease(`alshdavid/${PROJECT}`);
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-linux-amd64.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-linux-arm64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-macos-amd64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-macos-arm64.tar.gz`   },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-windows-amd64.tar.gz` },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64', url: `https://github.com/alshdavid/${PROJECT}/releases/download/${version}/${PROJECT}-${version}-windows-arm64.tar.gz` },
  ]
}
