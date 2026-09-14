import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

// Only initialize the Pool and PrismaPg adapter if connection string exists.
// This prevents crashes during Vercel static build steps when env vars might be missing.
const pool = connectionString ? new Pool({ connectionString }) : null;
const adapter = pool ? new PrismaPg(pool) : null;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient(adapter ? { adapter } : {});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
