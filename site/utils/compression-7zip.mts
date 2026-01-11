import * as fs from "node:fs";
import * as path from "node:path";
import { sh } from "./sh.mts";

export async function tarGz(folder: string, dest: string): Promise<void> {
  console.log(`[compress:tar.gz] ${dest}`);

  const tarFile = dest.replace(/\.gz$/, "");

  await sh("7z", ["a", "-ttar", tarFile, "*"], {
    stdio: "inherit",
    cwd: folder,
  });

  await sh("7z", ["a", "-tgzip", dest, tarFile], {
    stdio: "inherit",
  });

  fs.rmSync(tarFile, { force: true });
}

export async function untarGz(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  console.log(`[extract] ${archive}`);
  if (path.dirname(archive) !== dest && fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  const tarFile = archive.replace(/\.gz$/, "");
  await sh("7z", ["x", archive, `-o${path.dirname(tarFile)}`, "-y"], {
    stdio: "inherit",
  });

  if (stripComponents) {
    const tempDir = path.join(dest, ".temp_extract");
    fs.mkdirSync(tempDir, { recursive: true });

    await sh("7z", ["x", tarFile, `-o${tempDir}`, "-y"], {
      stdio: "inherit",
    });

    let sourceDir = tempDir;
    for (let i = 0; i < stripComponents; i++) {
      const entries = fs.readdirSync(sourceDir).filter(entry => {
        return !entry.endsWith('.paxheader') && 
               entry !== 'pax_global_header' &&
               !entry.endsWith('.data');
      });
      
      if (
        entries.length === 1 &&
        fs.statSync(path.join(sourceDir, entries[0])).isDirectory()
      ) {
        sourceDir = path.join(sourceDir, entries[0]);
      } else {
        break;
      }
    }

    const entries = fs.readdirSync(sourceDir).filter(entry => {
      return !entry.endsWith('.paxheader') && 
             entry !== 'pax_global_header' &&
             !entry.endsWith('.data');
    });
    
    for (const entry of entries) {
      fs.renameSync(path.join(sourceDir, entry), path.join(dest, entry));
    }

    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(tarFile, { force: true });
  } else {
    await sh("7z", ["x", tarFile, `-o${dest}`, "-y"], {
      stdio: "inherit",
    });
    fs.rmSync(tarFile, { force: true });
  }
}

export async function tarXz(folder: string, dest: string): Promise<void> {
  console.log(`[compress:tar.xz] ${dest}`);

  // 7z creates tar.xz in two steps: first create .tar, then compress to .tar.xz
  const tarFile = dest.replace(/\.xz$/, "");

  // Create .tar archive
  await sh("7z", ["a", "-ttar", tarFile, "*"], {
    stdio: "inherit",
    cwd: folder,
  });

  // Compress .tar to .tar.xz
  await sh("7z", ["a", "-txz", dest, tarFile], {
    stdio: "inherit",
  });

  // Clean up intermediate .tar file
  fs.rmSync(tarFile, { force: true });
}

export async function untarXz(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  console.log(`[extract] ${archive}`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  // 7z requires two-step extraction for .tar.xz files
  // First extract the .xz to get the .tar
  const tarFile = archive.replace(/\.xz$/, "");
  await sh("7z", ["x", archive, `-o${path.dirname(tarFile)}`, "-y"], {
    stdio: "inherit",
  });

  // Then extract the .tar with strip components handling
  if (stripComponents) {
    // Extract to temp directory first, then move contents
    const tempDir = path.join(dest, ".temp_extract");
    fs.mkdirSync(tempDir, { recursive: true });

    await sh("7z", ["x", tarFile, `-o${tempDir}`, "-y"], {
      stdio: "inherit",
    });

    // Navigate down stripComponents levels and move contents
    let sourceDir = tempDir;
    for (let i = 0; i < stripComponents; i++) {
      const entries = fs.readdirSync(sourceDir).filter(entry => {
        // Filter out pax headers and metadata files
        return !entry.endsWith('.paxheader') && 
               entry !== 'pax_global_header' &&
               !entry.endsWith('.data');
      });
      
      if (
        entries.length === 1 &&
        fs.statSync(path.join(sourceDir, entries[0])).isDirectory()
      ) {
        sourceDir = path.join(sourceDir, entries[0]);
      } else {
        break;
      }
    }

    // Move contents from sourceDir to dest
    const entries = fs.readdirSync(sourceDir).filter(entry => {
      // Filter out pax headers and metadata files when moving
      return !entry.endsWith('.paxheader') && 
             entry !== 'pax_global_header' &&
             !entry.endsWith('.data');
    });
    
    for (const entry of entries) {
      fs.renameSync(path.join(sourceDir, entry), path.join(dest, entry));
    }

    // Clean up temp directory and intermediate tar file
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(tarFile, { force: true });
  } else {
    await sh("7z", ["x", tarFile, `-o${dest}`, "-y"], {
      stdio: "inherit",
    });
    // Clean up intermediate tar file
    fs.rmSync(tarFile, { force: true });
  }
}

export async function zip(folder: string, dest: string): Promise<void> {
  console.log(`[compress:zip] ${dest}`);
  await sh("7z", ["a", "-tzip", dest, "*"], {
    stdio: "inherit",
    cwd: folder,
  });
}

export async function unzip(
  archive: string,
  dest: string,
  stripComponents?: number,
): Promise<void> {
  console.log(`[extract] ${archive}`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  if (stripComponents) {
    // Extract to temp directory first, then move contents
    const tempDir = path.join(dest, ".temp_extract");
    fs.mkdirSync(tempDir, { recursive: true });

    await sh("7z", ["x", archive, `-o${tempDir}`, "-y"], {
      stdio: "inherit",
    });

    // Navigate down stripComponents levels and move contents
    let sourceDir = tempDir;
    for (let i = 0; i < stripComponents; i++) {
      const entries = (await fs.promises.readdir(sourceDir)).filter(entry => {
        // Filter out pax headers and metadata files
        return !entry.endsWith('.paxheader') && 
               entry !== 'pax_global_header' &&
               !entry.endsWith('.data');
      });
      
      if (entries.length === 1) {
        const entryPath = path.join(sourceDir, entries[0]);
        const stat = await fs.promises.stat(entryPath);
        if (stat.isDirectory()) {
          sourceDir = entryPath;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Move contents from sourceDir to dest
    const entries = (await fs.promises.readdir(sourceDir)).filter(entry => {
      // Filter out pax headers and metadata files when moving
      return !entry.endsWith('.paxheader') && 
             entry !== 'pax_global_header' &&
             !entry.endsWith('.data');
    });
    
    for (const entry of entries) {
      await fs.promises.rename(
        path.join(sourceDir, entry),
        path.join(dest, entry),
      );
    }

    // Clean up temp directory
    await fs.promises.rm(tempDir, { recursive: true });
  } else {
    await sh("7z", ["x", archive, `-o${dest}`, "-y"], {
      stdio: "inherit",
    });
  }
}