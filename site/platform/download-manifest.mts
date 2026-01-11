import type { Arch, ArchiveFormat, Os } from "./types.mts";

export type DownloadManifestEntry = {
  project: string;
  version: string;
  format?: ArchiveFormat;
  url: undefined | string | (() => Promise<string | undefined>);
  os: Os;
  arch: Arch;
  stripComponents?: number;
};

export type DownloadManifest = Record<string, Array<DownloadManifestEntry>>;
