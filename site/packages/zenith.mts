import * as githubApi from "../platform/github.mts";
import { DownloadManifest } from "../platform/download-manifest.mts";

const PROJECT = "zenith";
const REPO = "bvaisvil/zenith";
const BASE = `https://github.com/bvaisvil/zenith/releases/download`;

export default async function zenith(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    url: `${BASE}/${version}/zenith-Linux-musl-x86_64.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    url: `${BASE}/${version}/zenith-Linux-musl-arm64.tar.gz`   },

    { project: PROJECT, version, os: 'macos',    arch:  'amd64',    url: `${BASE}/${version}/zenith-macOS-x86_64.tar.gz`  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    url: `${BASE}/${version}/zenith-macOS-arm64.tar.gz`  },

    // { project: PROJECT, version, os: 'windows',  arch:  'amd64',    url: `` },
  ]
}
