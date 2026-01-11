import type { DownloadManifest } from "../platform/download-manifest.mts";

type GoApiResponse = Array<{
  version: string;
}>;

export const PROJECT = "go";

export default async function go(manifest: DownloadManifest): Promise<void> {
  const resp = await globalThis.fetch("https://go.dev/dl/?mode=json");
  const body = (await resp.json()) as GoApiResponse;
  const version = body[0].version.replace("go", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    { project: PROJECT, version, os: 'linux',    arch:  'amd64', url: `https://go.dev/dl/go${version}.linux-amd64.tar.gz`,   stripComponents: 1  },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64', url: `https://go.dev/dl/go${version}.linux-arm64.tar.gz`,   stripComponents: 1  },
    { project: PROJECT, version, os: 'macos',    arch:  'amd64', url: `https://go.dev/dl/go${version}.darwin-amd64.tar.gz`,  stripComponents: 1  },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64', url: `https://go.dev/dl/go${version}.darwin-arm64.tar.gz`,  stripComponents: 1  },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64', url: `https://go.dev/dl/go${version}.windows-amd64.zip`,    stripComponents: 1  },
    { project: PROJECT, version, os: 'windows',  arch:  'arm64', url: `https://go.dev/dl/go${version}.windows-arm64.zip`,    stripComponents: 1  },
  ]
}
