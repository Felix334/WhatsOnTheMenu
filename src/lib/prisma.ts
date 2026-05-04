import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { prismaQueryInsights } from "@prisma/sqlcommenter-query-insights";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const pgAdapter = new PrismaPg(pool); // ✅ pg_adapter → pgAdapter (Konvention)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient; // ✅ Typ-Fix: "|" entfernt
};

// 🔥 LOCALHOST-ONLY LOGS!
const isDevelopment = process.env.NODE_ENV === 'development';
const enableInsights = process.env.QUERY_INSIGHTS !== 'false';
const logThreshold = parseInt(process.env.INSIGHTS_THRESHOLD || '10');

function createPrismaClient() {
  const client = new PrismaClient({
    adapter: pgAdapter,
    comments: [prismaQueryInsights()],
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" },
    ],
  });

  // ✅ TYPE-SAFE + LOCALHOST-ONLY!
  client.$on("query", (e: any) => {
    if (isDevelopment && enableInsights) {
      const duration = e.duration;
      if (duration > logThreshold) {
        const tableMatch = e.query?.match(/FROM\s+"([^"]+)"/);
        const table = tableMatch ? `[${tableMatch[1]}]` : '';
        const emoji = duration > 100 ? '🐌' : duration > 50 ? '⚠️' : '⏱️';
        
        console.log(`${emoji} ${duration.toFixed(1)}ms ${table} | ${e.query?.slice(0, 80)}...`);
      }
    }
  });

  client.$on("warn", (e: any) => {
    if (isDevelopment) {
      console.warn(`⚠️  ${e.message}`);
    }
  });

  client.$on("error", (e: any) => {
    if (isDevelopment) {
      console.error(`💥 ${e.message}`);
      if (e.query) {
        console.error(`   Query: ${e.query.slice(0, 200)}`);
      }
    }
  });

  // 🚀 Startup-Info
  if (isDevelopment) {
    console.log('🚀 QueryInsights aktiviert (localhost-only)');
    console.log(`   Threshold: ${logThreshold}ms | ENV: ${process.env.QUERY_INSIGHTS}`);
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
/*import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ errorFormat: "pretty", log: ["query", "error", "info", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}*/

/*
export const prisma =
  global.prisma ??
  new PrismaClient({
    errorFormat: "pretty",
    log: ["query", "info", "warn", "error"],
    accelerateUrl: process.env.DATABASE_URL
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
*/
