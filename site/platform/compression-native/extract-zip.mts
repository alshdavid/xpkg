import { join } from "node:path";
import AdmZip from "adm-zip";

export async function extractZip(
  buffer: ArrayBuffer,
  destination: string,
  stripComponents?: number,
): Promise<void> {
  const nodeBuffer = Buffer.from(buffer);
  const zip = new AdmZip(nodeBuffer);

  await new Promise<void>((resolve, reject) => {
    try {
      const entries = zip.getEntries();

      for (const entry of entries) {
        // Strip components from the path
        let entryPath = entry.entryName;

        if (stripComponents && stripComponents > 0) {
          const parts = entryPath.split("/");

          // If stripping more components than available, skip this entry
          if (parts.length <= stripComponents) {
            continue;
          }

          // Remove the first N components
          entryPath = parts.slice(stripComponents).join("/");

          // Skip if the result is empty
          if (!entryPath) {
            continue;
          }
        }

        const outputPath = join(destination, entryPath);

        if (entry.isDirectory) {
          // Create directory
          zip.extractEntryTo(entry, destination, false, true, false, entryPath);
        } else {
          // Extract file
          zip.extractEntryTo(entry, destination, false, true, false, entryPath);
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
