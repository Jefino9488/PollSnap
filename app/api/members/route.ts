// /app/api/members/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const members = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true, // Ensure profile picture is included
                createdAt: true,
            },
        });
        return NextResponse.json(members);
    } catch (error) {
        console.error("Failed to fetch members:", error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}