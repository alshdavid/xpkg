import type { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "just";

export default async function just(manifest: DownloadManifest): Promise<void> {
  const resp = await githubApi.getRelease("casey/just");
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-unknown-linux-musl.tar.gz`  },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-unknown-linux-musl.tar.gz` },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-apple-darwin.tar.gz`        },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-apple-darwin.tar.gz`       },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',       url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-pc-windows-msvc.zip`        },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64',       url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-pc-windows-msvc.zip`       },
  ]
}
