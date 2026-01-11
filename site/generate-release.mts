import * as fs from "node:fs";
import { Paths } from "./platform/paths.mts";
import {
  githubReleaseCreate,
  githubReleaseDelete,
  githubReleaseEdit,
  githubReleaseUpload,
} from "./utils/github-releases.mts";

const REPO = "alshdavid/xpkg";

type Manifest = {
  package: string;
  version: string;
};

export async function main() {
  if (!fs.existsSync(Paths["~/binaries"])) {
    console.log("Skipping release, no binaries present")
    return
  }
  
  for (const tagName of fs.readdirSync(Paths["~/binaries"])) {
    try {
      const manifestStr = await fs.promises.readFile(
        Paths["~/binaries/"](tagName, "meta.json"),
        "utf8",
      );
      const manifest: Manifest = JSON.parse(manifestStr);

      await githubReleaseCreate({
        repo: REPO,
        title: tagName,
        tag: tagName,
        draft: true,
        notes: JSON.stringify({
          package: manifest.package,
          version: manifest.version,
        }),
      });

      for (const fileName of fs.readdirSync(Paths["~/binaries/"](tagName))) {
        console.log(`[${tagName}] UPLOAD_RELEASE: ${fileName}`);
        await githubReleaseUpload({
          repo: REPO,
          tag: tagName,
          file: Paths["~/binaries/"](tagName, fileName),
        });
      }

      console.log(`[${tagName}] PUBLISH_RELEASE`);
      await githubReleaseEdit({
        repo: REPO,
        tag: tagName,
        draft: false,
      });

      console.log(tagName, manifest);
    } catch (error) {
      console.log(`[${tagName}] ===== FAILED =====`);
      console.log({ error });
      await githubReleaseDelete({
        repo: REPO,
        tag: tagName,
      });
      process.exit(1);
    }
  }
}

if (process.argv.includes("--run")) {
  main();
}
