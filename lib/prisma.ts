import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Mock data fallback provider in case PostgreSQL is offline during development/testing
 */
export const globalStats = {
  totalCarsHelped: 18450,
  totalPkrSaved: 6842900.0,
};

export const fallbackStore = {
  stats: globalStats,
  predictions: {
    todayPrice: 370.81,
    predictedPrice: 373.75,
    expectedDelta: 2.94,
    direction: "HIKE" as const,
    advice: "Fill up before midnight!",
    confidenceScore: 0.9712,
    oil7d: 95.96,
    pkr7d: 275.77,
    estimatedCAndF: 26462.89,
    updatedAt: new Date().toISOString(),
  },
};

