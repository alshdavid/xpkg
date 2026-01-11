import { promises as fs } from "node:fs";
import path from "node:path";

export async function flattenDirectory(
  rootPath: string,
): Promise<[string, string][]> {
  const result: [string, string][] = [];

  async function traverse(
    currentPath: string,
    relativePath: string = "",
  ): Promise<void> {
    const stats = await fs.stat(currentPath);
    const type = stats.isDirectory() ? "directory" : "file";

    // Add current item to result
    result.push([relativePath || "/", type]);

    // If it's a directory, traverse its contents
    if (stats.isDirectory()) {
      const entries = await fs.readdir(currentPath);

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry);
        const newRelativePath = relativePath
          ? `${relativePath}/${entry}`
          : `/${entry}`;
        await traverse(fullPath, newRelativePath);
      }
    }
  }

  await traverse(rootPath);

  result.sort((a, b) => a[0].localeCompare(b[0]));
  return result;
}
