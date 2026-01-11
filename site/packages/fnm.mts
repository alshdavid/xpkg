import * as githubApi from "../utils/github.mts";
import { DownloadManifest } from "../build-packages.mts";

const PROJECT = "fnm";
const REPO = "Schniz/fnm";
const BASE = `https://github.com/Schniz/fnm/releases/download`;

export default async function fnm(manifest: DownloadManifest): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    format: 'zip',    url: `${BASE}/v${version}/fnm-linux.zip`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    format: 'zip',    url: `${BASE}/v${version}/fnm-arm64.zip`   },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',    format: 'zip',    url: `${BASE}/v${version}/fnm-windows.zip` },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    format: 'bin',    url: `${BASE}/v${version}/fnm-macos.zip`  },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64',    format: 'bin',    url: `${BASE}/v${version}/fnm-macos.zip`  },
  ]
}
