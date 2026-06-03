import { resolve } from "path";

import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads .env.local; Prisma CLI only loads .env by default
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

// Generate only needs a valid URL shape; db push validates env in scripts/db-push.mjs
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
    ...(process.env.DIRECT_URL ? { directUrl: process.env.DIRECT_URL } : {}),
  },
});
