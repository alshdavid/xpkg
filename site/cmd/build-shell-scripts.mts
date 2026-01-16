import * as fs from "node:fs";
import { Paths } from "../platform/paths.mts";
import { renderEjs } from "../platform/render-ejs.mts";

type Mod = {
  PROJECT?: string;
};

export async function main() {
  if (!fs.existsSync(Paths["~/dist"])) {
    await fs.promises.mkdir(Paths["~/dist"], { recursive: true });
  }

  const packages = fs.readdirSync(Paths['~/']('scripts'))
    .filter(v => v.startsWith('pkg_'))
    .filter(v => !v.includes('_build_'))
    .map(v => v.replace('pkg_', ''))

  for (const binName of packages) {
    await renderEjs({
      inputFile: Paths["~/site/"]("templates", "install.sh"),
      outputFile: Paths["~/dist/"](`${binName}.sh`),
      packageName: binName,
      PACKAGE_NAME: binName.toUpperCase().replaceAll("-", "_"),
      package_name: binName.replaceAll("-", "_"),
    });
  }
}

if (process.argv.includes("--run")) {
  main();
}