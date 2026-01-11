import * as fs from "node:fs";
import * as path from "node:path";
import { releaseExists } from "../platform/repackage-versions/release-exists.mts";
import { recompress } from "../platform/repackage-versions/recompress.mts";
import {
  inferArchiveFormat,
  sortEntries,
} from "../platform/repackage-versions/infer-format.mts";
import * as packages from "../packages/index.mts";
import { Paths } from "../platform/paths.mts";
import {
  DownloadManifest,
  DownloadManifestEntry,
} from "../platform/download-manifest.mts";
import { REPO } from "../platform/repo-name.mts";
import { renderEjs } from "../platform/render-ejs.mts";

type Mod = {
  PROJECT?: string;
};

export async function main() {
  if (!fs.existsSync(Paths["~/dist"])) {
    await fs.promises.mkdir(Paths["~/dist"], { recursive: true });
  }

  for (const [modName, mod] of Object.entries(
    packages as Record<string, Mod>,
  )) {
    if (!mod.PROJECT) {
      throw new Error(`ERROR: ${modName} is missing exports.PROJECT`);
    }
    const projectName = mod.PROJECT;

    await renderEjs({
      inputFile: Paths["~/site/"]("templates", "install.sh"),
      outputFile: Paths["~/dist/"](`${projectName}.sh`),
      packageName: projectName,
      PACKAGE_NAME: projectName.toUpperCase().replaceAll("-", "_"),
      package_name: projectName.replaceAll("-", "_"),
    });
  }
}

if (process.argv.includes("--run")) {
  main();
}
