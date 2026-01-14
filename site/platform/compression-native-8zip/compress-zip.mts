import { archiveUtil } from "./archive-util.mts";

export async function compressZip(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  await archiveUtil(
    "compress-zip",
    "--output",
    destination,
    "--cwd",
    cwd,
    target,
  );
}
