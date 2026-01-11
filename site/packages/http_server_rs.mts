import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../platform/github.mts";

export default async function http_server_rs(
  manifest: DownloadManifest,
): Promise<void> {
  const project = "http-server-rs";
  const resp = await githubApi.getRelease(`alshdavid/${project}`);
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-linux-amd64.tar.gz`   },
    { project, version, os: 'linux',    arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-linux-arm64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-macos-amd64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-macos-arm64.tar.gz`   },
    { project, version, os: 'windows',  arch:  'amd64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-windows-amd64.tar.gz` },
    { project, version, os: 'windows',  arch:  'arm64', url: `https://github.com/alshdavid/${project}/releases/download/${version}/${project}-windows-arm64.tar.gz` },
  ]
}
