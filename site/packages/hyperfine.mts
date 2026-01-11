import * as githubApi from "../utils/github.mts";
import { DownloadManifest } from "../build-packages.mts";

const PROJECT = "hyperfine";
const REPO = "sharkdp/hyperfine";
const BASE = `https://github.com/sharkdp/hyperfine/releases/download`;

export default async function hyperfine(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name.replace("v", "");;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    url: `${BASE}/v${version}/hyperfine-v${version}-x86_64-unknown-linux-musl.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    url: `${BASE}/v${version}/hyperfine-v${version}-aarch64-unknown-linux-gnu.tar.gz`   },

    { project: PROJECT, version, os: 'macos',    arch:  'amd64',    url: `${BASE}/v${version}/hyperfine-v${version}-x86_64-apple-darwin.tar.gz`  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    url: `${BASE}/v${version}/hyperfine-v${version}-aarch64-apple-darwin.tar.gz`  },

    { project: PROJECT, version, os: 'windows',  arch:  'amd64',    url: `${BASE}/v${version}/hyperfine-v${version}-x86_64-pc-windows-msvc.zip` },
  ]
}
