import { archiveUtil } from "./archive-util.mts";

export async function compressTarXz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  await archiveUtil(
    "compress-tar-xz",
    "--output",
    destination,
    "--cwd",
    cwd,
    target,
  );
}
