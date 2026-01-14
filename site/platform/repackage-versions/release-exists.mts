import { githubReleaseView } from "../github-releases.mts";

export async function releaseExists(
  repo: string,
  tag: string,
): Promise<boolean> {
  try {
    return !!(await githubReleaseView({
      repo,
      tag,
    }));    
  } catch (error) {
    return false
  }
}
