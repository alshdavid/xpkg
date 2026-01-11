import * as githubApi from "../platform/github.mts";
import { DownloadManifest } from "../platform/download-manifest.mts";

const PROJECT = "oha";
const REPO = "hatoo/oha";
const BASE = `https://github.com/hatoo/oha/releases/download`;

export default async function oha(manifest: DownloadManifest): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',  format: 'bin',    url: `${BASE}/v${version}/oha-linux-amd64`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',  format: 'bin',    url: `${BASE}/v${version}/oha-linux-arm64`   },

    { project: PROJECT, version, os: 'macos',    arch:  'amd64',  format: 'bin',    url: `${BASE}/v${version}/oha-macos-amd64`  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',  format: 'bin',    url: `${BASE}/v${version}/oha-macos-arm64`  },
    
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',  format: 'bin',    url: `${BASE}/v${version}/oha-windows-amd64.exe` },
  ]
}
