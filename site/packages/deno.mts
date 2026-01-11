import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../utils/github.mts";

export default async function deno(manifest: DownloadManifest): Promise<void> {
  const project = "deno";
  const resp = await githubApi.getRelease("denoland/deno");
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64',   url: `https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-unknown-linux-gnu.zip`   },
    { project, version, os: 'linux',    arch:  'arm64',   url: `https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-unknown-linux-gnu.zip`  },
    { project, version, os: 'macos',    arch:  'amd64',   url: `https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-apple-darwin.zip`        },
    { project, version, os: 'macos',    arch:  'arm64',   url: `https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-apple-darwin.zip`       },
    { project, version, os: 'windows',  arch:  'amd64',   url: `https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-pc-windows-msvc.zip`     },
  ]
}
