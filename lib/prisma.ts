import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaOptions = {
    log: ["query", "info", "warn", "error"] as Array<"query" | "info" | "warn" | "error">,
};

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    console.log("Prisma client initialized in development mode");
}

prisma.$connect()
    .then(() => console.log("Prisma connected to database"))
    .catch((error) => console.error("Prisma failed to connect:", error));

// Cleanup function for old polls
export async function cleanupOldPolls() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        const deleted = await prisma.poll.deleteMany({
            where: { createdAt: { lt: twentyFourHoursAgo } },
        });
        console.log(`Cleaned up ${deleted.count} old polls.`);
    } catch (error) {
        console.error("Failed to clean up old polls:", error);
    }
}

// // Run cleanup every hour in development
// if (process.env.NODE_ENV !== "production") {
//     setInterval(cleanupOldPolls, 60 * 60 * 1000); // Every hour
// }

export default prisma;