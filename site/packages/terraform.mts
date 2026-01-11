import type { DownloadManifest } from "../build-packages.mts";
import * as githubApi from "../platform/github.mts";

export default async function terraform(
  manifest: DownloadManifest,
): Promise<void> {
  const project = "terraform";
  const resp = await githubApi.getRelease("hashicorp/terraform");
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`   },
    { project, version, os: 'linux',    arch:  'arm64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_arm64.zip`   },
    { project, version, os: 'macos',    arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_amd64.zip`  },
    { project, version, os: 'macos',    arch:  'arm64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_arm64.zip`  },
    { project, version, os: 'windows',  arch:  'amd64',     url: `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_windows_amd64.zip` },
  ]
}
