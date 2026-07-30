// Downloads the sourced photos into public/images/. Run: node scripts/download-images.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = String.raw`C:\Users\spent\AppData\Local\Temp\claude\C--Users-spent-Desktop-tour-website\b28cf797-2bc5-4f08-9a8b-efb3d352c1b3\tasks\w2yv51ipo.output`;
const { result } = JSON.parse(fs.readFileSync(OUT, "utf8"));
const images = result.images;

const baseDir = path.join(process.cwd(), "public", "images");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

let ok = 0, fail = 0;
for (const img of images) {
  const url = img.url.replace(/&amp;/g, "&");
  const dest = path.join(baseDir, img.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(dest, buf);
    console.log(`OK   ${img.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (e) {
    console.warn(`FAIL ${img.file}  ${url}  -> ${e.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`);
