import { promises as fs } from "node:fs";
import path from "node:path";

export type FsEntry = [string, "file" | "directory"];

export async function flattenDirectory(
  rootPath: string,
): Promise<[string, string][]> {
  const result: Array<FsEntry> = [];

  async function traverse(
    currentPath: string,
    relativePath: string = "",
  ): Promise<void> {
    const stats = await fs.stat(currentPath);
    const type = stats.isDirectory() ? "directory" : "file";

    result.push([relativePath || "/", type]);

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

  return sortDirectoryStructure(result);
}

function sortDirectoryStructure(entries: FsEntry[]): FsEntry[] {
  const result: FsEntry[] = [];

  const grouped = new Map<string, FsEntry[]>();

  for (const entry of entries) {
    const [path] = entry;
    const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";

    if (!grouped.has(parentPath)) {
      grouped.set(parentPath, []);
    }
    grouped.get(parentPath)!.push(entry);
  }

  function processLevel(parentPath: string): FsEntry[] {
    const children = grouped.get(parentPath) || [];
    const levelResult: FsEntry[] = [];

    const files = children.filter(([_, type]) => type === "file");
    const directories = children.filter(([_, type]) => type === "directory");

    files.sort((a, b) => a[0].localeCompare(b[0]));
    levelResult.push(...files);

    directories.sort((a, b) => a[0].localeCompare(b[0]));

    for (const dir of directories) {
      levelResult.push(dir);
      levelResult.push(...processLevel(dir[0]));
    }

    return levelResult;
  }

  return processLevel("/");
}
