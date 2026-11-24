import fs from "fs";
import { fileURLToPath } from "url";

const DATABASE_URL = process.env.DATABASE_URL || "./data/cue.db";
const splitUrl = DATABASE_URL.split("/");

const folderName = splitUrl.length > 1 ? splitUrl[1] : "data";

const targetDir = fileURLToPath(new URL(`../${folderName}`, import.meta.url));
fs.mkdirSync(targetDir, { recursive: true });
