import semver from "npm:semver";

void async function main() {
  const resp = await getReleases();

  const allVersions: Record<string, Array<string>> = {};

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

  const allVersionsEntries: Array<[string, Array<string>]> = Object.entries(allVersions);
  allVersionsEntries.sort((a, b) => sortEntries(`${a[0]}.0.0`, `${b[0]}.0.0`));
  const versions: Array<[string, Array<string>]> = []

  for (let i = 0; i < 7; i+= 1) {
    const result = allVersionsEntries.pop()
    if (!result) break
    versions.push(result)
  }

  let output: string[] = []

  for (const [, version] of versions) {
    for (const innerVersion of version) {
      output.push(innerVersion)
    }
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(output.join(" "));
  Deno.stdout.writeSync(data)
}()

export type NodejsReleasesResponse = Array<{
  version: string;
  date: string;
  files: Array<string>;
  npm: string;
  v8: string;
  uv: string;
  zlib: string;
  openssl: string;
  modules: string;
  lts: boolean;
  security: boolean;
}>;

export async function getReleases(): Promise<NodejsReleasesResponse> {
  const resp = await globalThis.fetch(
    "https://nodejs.org/download/release/index.json",
  );
  if (!resp.ok) {
    throw new Error(`Unable to fetch release for Nodejs`);
  }
  const body = await resp.json();
  return body as NodejsReleasesResponse;
}

export function sortEntries(a: string, b: string) {
  try {
    const semverA = tryParseSemver(a);
    const semverB = tryParseSemver(b);

    if (semverA && semverB) {
      return semver.compare(semverA, semverB);
    } else if (semverA) {
      return -1;
    } else if (semverB) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  } catch (e) {
    return a.localeCompare(b);
  }
}

export function tryParseSemver(str: string): semver.SemVer | undefined {
  const result = semver.parse(str);
  if (result) {
    return result;
  }
  const [, version] = str.split("-");
  const result2 = semver.parse(version);
  if (result2) {
    return result2;
  }
  return undefined;
}
