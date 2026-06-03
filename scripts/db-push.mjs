import { execSync } from "node:child_process";
import { resolve } from "node:path";

import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const pushUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!pushUrl) {
  console.error("Set DIRECT_URL (or DATABASE_URL) in .env.local");
  process.exit(1);
}

execSync("prisma db push", {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: pushUrl,
    DIRECT_URL: pushUrl,
  },
});
