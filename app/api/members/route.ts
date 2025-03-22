import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPrisma } from "@/lib/withPrisma";

const handler = async () => {
    try {
        const members = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });
        return NextResponse.json(members);
    } catch (error) {
        console.error("Failed to fetch members:", error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
};

export const GET = withPrisma(handler);