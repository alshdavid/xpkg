import { Paths } from "./platform/paths.mts";
import { flattenDirectory } from "./utils/flat_dir.mts";

export async function main() {
  console.log(await flattenDirectory(Paths['~/dist']))
}

if (process.argv.includes("--run")) {
  main();
}
