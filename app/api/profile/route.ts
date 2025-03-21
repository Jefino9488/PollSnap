import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                polls: {
                    include: {
                        options: { select: { id: true, text: true, voteCount: true } },
                    },
                },
                votes: {
                    include: {
                        poll: { select: { id: true, title: true } },
                        option: { select: { id: true, text: true } },
                    },
                },
            },
        });

        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const formattedData = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            createdPolls: userData.polls.map((poll) => ({
                id: poll.id,
                title: poll.title,
                totalVotes: poll.totalVotes,
                options: poll.options,
            })),
            votesCast: userData.votes.map((vote) => ({
                pollId: vote.pollId,
                pollTitle: vote.poll.title,
                optionId: vote.optionId,
                optionText: vote.option.text,
                createdAt: vote.createdAt,
            })),
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
        return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.$transaction([
            prisma.vote.deleteMany({ where: { userId: session.user.id } }),
            prisma.poll.deleteMany({ where: { createdById: session.user.id } }),
            prisma.user.delete({ where: { id: session.user.id } }),
        ]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete account:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}