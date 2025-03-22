import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPrisma } from "@/lib/withPrisma";

const handler = async (request: Request) => {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
        const skip = (page - 1) * pageSize;

        const [members, total] = await Promise.all([
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                },
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" }, // Optional: sort by creation date
            }),
            prisma.user.count(),
        ]);

        const hasMore = skip + members.length < total;

        return NextResponse.json({ members, hasMore });
    } catch (error) {
        console.error("Failed to fetch members:", error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
};

export const GET = withPrisma(handler);