import type { DownloadManifest } from "../repackage-versions.mts";
import * as githubApi from "../utils/github.mts";

export default async function vultrCli(
  manifest: DownloadManifest,
): Promise<void> {
  const project = "vultr-cli";
  const resp = await githubApi.getRelease("vultr/vultr-cli");
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${project}-${version}`] = [
    { project, version, os: 'linux',    arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_linux_amd64.tar.gz`   },
    { project, version, os: 'linux',    arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_linux_arm64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_macOs_amd64.tar.gz`   },
    { project, version, os: 'macos',    arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_macOs_arm64.tar.gz`   },
    { project, version, os: 'windows',  arch:  'amd64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_windows_amd64.zip`    },
    { project, version, os: 'windows',  arch:  'arm64', url: `https://github.com/vultr/vultr-cli/releases/download/v${version}/vultr-cli_v${version}_windows_arm64.zip`    },
  ]
}
