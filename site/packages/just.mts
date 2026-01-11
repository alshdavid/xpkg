import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../platform/github.mts";

export default async function just(manifest: DownloadManifest): Promise<void> {
  const project = "just";
  const resp = await githubApi.getRelease("casey/just");
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-unknown-linux-musl.tar.gz`  },
    { project, version, os: 'linux',    arch:  'arm64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-unknown-linux-musl.tar.gz` },
    { project, version, os: 'macos',    arch:  'amd64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-apple-darwin.tar.gz`        },
    { project, version, os: 'macos',    arch:  'arm64',    url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-apple-darwin.tar.gz`       },
    { project, version, os: 'windows',  arch:  'amd64',       url: `https://github.com/casey/just/releases/download/${version}/just-${version}-x86_64-pc-windows-msvc.zip`        },
    { project, version, os: 'windows',  arch:  'arm64',       url: `https://github.com/casey/just/releases/download/${version}/just-${version}-aarch64-pc-windows-msvc.zip`       },
  ]
}
