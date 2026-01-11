import * as fs from "node:fs";
import { Paths } from "../platform/paths.mts";
import { flattenDirectory } from "../platform/flat_dir.mts";

export async function main() {
  let html = `
    <style>
      a {
        display: block;
      }
    </style>
  `;
  for (const [linkPath, linkType] of await flattenDirectory(Paths["~/dist"])) {
    if (linkType !== "file") continue;
    if (linkPath.endsWith('.gitkeep')) continue;

    html += `
      <a href="${linkPath}">${linkPath}</a>
    `;
  }

  fs.writeFileSync(Paths["~/dist/"]("index.html"), html, "utf8");
}

if (process.argv.includes("--run")) {
  main();
}
