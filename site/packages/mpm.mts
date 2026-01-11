import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../platform/github.mts";

export default async function mpm(manifest: DownloadManifest): Promise<void> {
  const project = "mpm";
  const resp = await githubApi.getRelease(`alshdavid/${project}`);
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-linux-amd64.tar.gz`   },
    { project, version, os: 'linux',    arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-linux-arm64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-macos-amd64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-macos-arm64.tar.gz`   },
    { project, version, os: 'windows',  arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-windows-amd64.tar.gz` },
    { project, version, os: 'windows',  arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-${version}-windows-arm64.tar.gz` },
  ]
}
