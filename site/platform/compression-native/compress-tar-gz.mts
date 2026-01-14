import { archiveUtil } from "./archive-util.mts";

export async function compressTarGz(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  await archiveUtil(
    "compress-tar-gz",
    "--output",
    destination,
    "--cwd",
    cwd,
    target,
  );
}
