import { PrismaClient } from "src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

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
