import type { DownloadManifest } from "../repackage-versions.mts";
import * as nodejsApi from "../utils/nodejs.mts";
import { sortEntries } from "../repackage-versions/infer-format.mts";

export default async function nodejs(
  manifest: DownloadManifest,
): Promise<void> {
  const project = "nodejs";
  const resp = await nodejsApi.getReleases();

  const allVersions: Record<string, Array<string>> = {};

  // // Get all versions of Nodejs
  // for (const release of resp) {
  //   const version = release.version.replace("v", "");
  //   const [major, minor, patch] = version.split('.')
  //   const majorInt = parseInt(major, 10)
  //   if (majorInt < 18) continue

  //   // prettier-ignore
  //   manifest[`${project}-${version}`] = [
  //     { project, version, os: 'linux',    arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-linux-x64.tar.gz`,     stripComponents: 1 },
  //     { project, version, os: 'linux',    arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-linux-arm64.tar.gz`,   stripComponents: 1 },
  //     { project, version, os: 'macos',    arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-darwin-x64.tar.gz`,    stripComponents: 1 },
  //     { project, version, os: 'macos',    arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-darwin-arm64.tar.gz`,  stripComponents: 1 },
  //     { project, version, os: 'windows',  arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-win-x64.zip`,          stripComponents: 1 },
  //     { project, version, os: 'windows',  arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-win-arm64.zip`,        stripComponents: 1 },
  //   ]
  // }

  // Get the latest release of the last 7 major releases
  for (const release of resp) {
    const version = release.version.replace("v", "");
    const [major, minor] = version.split(".");
    const key = `${major}`;
    allVersions[key] = allVersions[key] || [];
    if (allVersions[key].length >= 1) {
      continue;
    }
    allVersions[key].push(version);
  }

  const allVersionsEntries = Object.entries(allVersions);
  allVersionsEntries.sort((a, b) => sortEntries(`${a[0]}.0.0`, `${b[0]}.0.0`));
  const versions = [
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
    allVersionsEntries.pop(),
  ];

  for (const [_, minorVersions] of versions) {
    for (const version of minorVersions) {
      // prettier-ignore
      manifest[`${project}-${version}`] = [
        { project, version, os: 'linux',    arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-linux-x64.tar.gz`,     stripComponents: 1 },
        { project, version, os: 'linux',    arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-linux-arm64.tar.gz`,   stripComponents: 1 },
        { project, version, os: 'macos',    arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-darwin-x64.tar.gz`,    stripComponents: 1 },
        { project, version, os: 'macos',    arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-darwin-arm64.tar.gz`,  stripComponents: 1 },
        { project, version, os: 'windows',  arch:  'amd64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-win-x64.zip`,          stripComponents: 1 },
        { project, version, os: 'windows',  arch:  'arm64', url: `https://nodejs.org/download/release/v${version}/node-v${version}-win-arm64.zip`,        stripComponents: 1 },
      ]
    }
  }
}
