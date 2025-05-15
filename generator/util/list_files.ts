import { readdir } from "fs/promises";
import * as path from "path";

export default async function listFilesWithExtensions(
  dir: string,
  extensions: string[],
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return await listFilesWithExtensions(fullPath, extensions);
      } else if (
        entry.isFile() &&
        extensions.includes(path.extname(entry.name).toLowerCase())
      ) {
        return [fullPath];
      } else {
        return [];
      }
    }),
  );

  return files.flat();
}
