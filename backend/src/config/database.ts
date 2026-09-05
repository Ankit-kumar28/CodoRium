import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const connectionUrl = new URL(rawConnectionString);
const isRenderDatabase = connectionUrl.hostname.endsWith("render.com");

if (isRenderDatabase && !connectionUrl.searchParams.has("sslmode")) {
  connectionUrl.searchParams.set("sslmode", "require");
}

const pool = new Pool({
  connectionString: connectionUrl.toString(),
  max: 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}