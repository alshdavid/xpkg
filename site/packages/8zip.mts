import { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "8zip";

export default async function deno(manifest: DownloadManifest): Promise<void> {
  const resp = await githubApi.getRelease("alshdavid/8zip");
  const version = resp.tag_name;

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-linux-amd64.tar.xz`    },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-linux-arm64.tar.xz`    },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-macos-amd64.tar.xz`    },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-macos-arm64.tar.xz`    },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-windows-amd64.tar.xz`  },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64',   url: `https://github.com/alshdavid/8zip/releases/download/${version}/8zip-windows-arm64.tar.xz`  },
  ]
}
