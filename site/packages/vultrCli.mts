import type { DownloadManifest } from "../platform/download-manifest.mts";
import * as githubApi from "../platform/github.mts";

export const PROJECT = "vultr-cli";

export default async function vultrCli(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease("vultr/vultr-cli");
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_linux_amd64.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_linux_arm64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_macOs_amd64.tar.gz`   },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_macOs_arm64.tar.gz`   },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_windows_amd64.zip`    },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_windows_arm64.zip`    },
  ]
}
