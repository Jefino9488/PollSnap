import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, options, isAnonymous } = await request.json();

    if (!title.trim()) {
        return NextResponse.json({ error: "Please enter a poll title" }, { status: 400 });
    }

    const validOptions = options.filter((opt: string) => opt.trim() !== "");
    if (validOptions.length < 2) {
        return NextResponse.json({ error: "Please add at least two options" }, { status: 400 });
    }

    try {
        const poll = await prisma.poll.create({
            data: {
                title,
                isAnonymous,
                createdById: session.user.id,
                options: {
                    create: validOptions.map((text: string) => ({ text })),
                },
            },
        });

        return NextResponse.json({ success: true, poll });
    } catch (error) {
        console.error("Poll creation error:", error);
        return NextResponse.json({ error: "Failed to create poll" }, { status: 500 });
    }
}