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

export async function getLatestNodejsLTS(): Promise<string> {
  const response = await fetch("https://nodejs.org/dist/index.json");
  const releases = (await response.json()) as Array<{
    lts?: boolean;
    version: string;
  }>;

  const latestLTS = releases.find((release) => release.lts !== false);
  if (!latestLTS) {
    throw new Error("No LTS release found");
  }
  return latestLTS.version.replace("v", "");
}
