import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import AdmZip from "adm-zip";

export async function compressZip(
  cwd: string,
  target: string,
  destination: string,
): Promise<void> {
  const zip = new AdmZip();
  const fullPath = join(cwd, target);

  const stats = await stat(fullPath);

  if (stats.isDirectory()) {
    await addDirectoryToZip(zip, cwd, target);
  } else {
    const relativePath = target === "." ? "" : target;
    zip.addLocalFile(fullPath, relativePath ? join(relativePath, "..") : "");
  }

  await new Promise<void>((resolve, reject) => {
    zip.writeZip(destination, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function addDirectoryToZip(
  zip: AdmZip,
  cwd: string,
  target: string,
): Promise<void> {
  const fullPath = join(cwd, target);
  const entries = await readdir(fullPath);

  for (const entry of entries) {
    const entryPath = join(fullPath, entry);
    const relativePath = relative(cwd, entryPath);
    const stats = await stat(entryPath);

    if (stats.isDirectory()) {
      await addDirectoryToZip(zip, cwd, relative(cwd, entryPath));
    } else if (stats.isFile()) {
      zip.addLocalFile(entryPath, join(relativePath, ".."));
    }
  }
}
