import { sh } from "../sh.mts";

export async function archiveUtil(...args: string[]): Promise<void> {
  // await sh("cargo", ["run", "--release", "-p", "archive-util", "--", ...args], {
  //   stdio: "ignore",
  // });
  await sh("8zip", args, {
    stdio: "ignore",
  });
}
