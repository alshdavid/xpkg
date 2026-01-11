import * as fs from "node:fs";
import * as path from "node:path";
import { sh } from "./sh.mts";

export async function wget(url: string, dest: string): Promise<void> {
  if (!fs.existsSync(path.dirname(dest))) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
  }
  if (fs.existsSync(dest)) {
    return;
  }

  await sh("wget", [
    "--progress=bar:force:noscroll",
    "--trust-server-names",
    "-O",
    dest,
    url,
  ]);
}
