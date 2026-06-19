import fs from "fs";
import path from "path";

const root = process.cwd();
const srcAssets = path.join(root, "src", "assets");
const publicAssets = path.join(root, "public", "assets", "anhHotel");

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
      console.log(`Copied ${srcPath} -> ${destPath}`);
    }
  }
}

(async () => {
  try {
    // copy anhHotel folder if exists
    const srcAnhHotel = path.join(srcAssets, "anhHotel");
    if (fs.existsSync(srcAnhHotel)) {
      await copyDir(srcAnhHotel, publicAssets);
    }

    // copy uploads folder if exists
    const srcUploads = path.join(srcAssets, "uploads");
    if (fs.existsSync(srcUploads)) {
      const destUploads = path.join(publicAssets, "uploads");
      await copyDir(srcUploads, destUploads);
    }

    console.log("Asset copy completed.");
  } catch (err) {
    console.error("Error copying assets:", err);
    process.exit(1);
  }
})();
