import * as fs from "node:fs";
import { Paths } from "../platform/paths.mts";

export async function main() {
  for (const file of await fs.promises.readdir(Paths["~/"]("sh"))) {
    await fs.promises.cp(Paths["~/"]("sh", file), Paths["~/dist/"](file));
  }

  for (const file of await fs.promises.readdir(Paths["~/"]("ps1"))) {
    await fs.promises.cp(Paths["~/"]("ps1", file), Paths["~/dist/"](file));
  }

  await fs.promises.cp(Paths["~/"]("assets"), Paths["~/dist/"]("assets"), {
    recursive: true,
  });
}

if (process.argv.includes("--run")) {
  main();
}
