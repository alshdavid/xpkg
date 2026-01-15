void async function main() {
  const resp = await getRelease("astral-sh/python-build-standalone");
  const downloads: Array<{
    version: string,
    os: string,
    arch: string,
    url: string
  }> = []

  for (const asset of resp.assets) {
    if (!asset.name.includes("x86_64-") && !asset.name.includes("aarch64")) {
      continue;
    }
    if (
      !asset.name.includes("linux-gnu-install_only_stripped") &&
      !asset.name.includes("windows-msvc-install_only_stripped") &&
      !asset.name.includes("darwin-install_only_stripped")
    ) {
      continue;
    }

    const segs = asset.name.split("-");
    const [major, minor, patch] = segs[1].split("+")[0].split(".");
    const arch = (
      {
        x86_64: "amd64",
        aarch64: "arm64",
      } as Record<string, string>
    )[segs[2]];
    const os = (
      {
        darwin: "macos",
        windows: "windows",
        linux: "linux",
      } as Record<string, string>
    )[segs[4]];
    if (!arch || !os) {
      continue;
    }

    const version = `${major}.${minor}.${patch}`;

    downloads.push({
      version,
      os,
      arch,
      url: asset.browser_download_url,
    })
  }

  const output: Record<string, Array<{
    version: string,
    os_arch: string,
    url: string,
  }>> = {}

  for (const entry of downloads) {
    if (!output[entry.version]) output[entry.version] = []
    output[entry.version].push({
      version: entry.version,
      os_arch: `${entry.os}-${entry.arch}`,
      url: entry.url,
    })
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(Object.entries(output)));
  Deno.stdout.writeSync(data)
}()

export type GithubReleaseResponse = {
  tag_name: string;
  body?: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
};

export async function getRelease(
  repo: string,
  tag?: string,
): Promise<GithubReleaseResponse> {
  let endpoint = "latest";
  if (tag) {
    endpoint = `tags/${tag}`;
  }
  const url = `https://api.github.com/repos/${repo}/releases/${endpoint}`;
  let init: RequestInit | undefined = undefined;
  if (process.env.GITHUB_TOKEN) {
    init = {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    };
  }
  const resp = await globalThis.fetch(url, init);
  if (!resp.ok) {
    console.log(resp.statusText);
    throw new Error(`Unable to fetch release for ${url}`);
  }
  const body = await resp.json();
  return body as GithubReleaseResponse;
}
