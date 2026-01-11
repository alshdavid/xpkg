import type { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "terraform";

export default async function terraform(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease("hashicorp/terraform");
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_arm64.zip`   },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_amd64.zip`  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_arm64.zip`  },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_windows_amd64.zip` },
  ]
}
