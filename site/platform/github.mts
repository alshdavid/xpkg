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

export type GithubReleasesResponse = Array<{
  tag_name: string;
  body?: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}>;

export async function getReleasesPage(
  repo: string,
  page: number = 1,
): Promise<GithubReleasesResponse> {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`;
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
  const body = (await resp.json()) as GithubReleasesResponse;
  if (!Array.isArray(body)) return [];
  if (body.length === 0) return [];
  return body;
}

export async function* getReleases(
  repo: string,
): AsyncIterable<GithubReleasesResponse[0]> {
  let page = 1;

  while (true) {
    const body = await getReleasesPage(repo, page);
    page += 1;
    if (body.length === 0) break;

    for (const release of body) {
      yield release;
    }
  }
}
