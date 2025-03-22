import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { withPrisma } from "@/lib/withPrisma";

const handler = async (request: Request) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { pollId, optionId } = await request.json();
    if (!pollId || !optionId) {
        return NextResponse.json({ error: "Missing pollId or optionId" }, { status: 400 });
    }

    try {
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_pollId: { userId, pollId },
            },
        });

        if (existingVote) {
            return NextResponse.json({ error: "You have already voted on this poll" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const vote = await tx.vote.create({
                data: { userId, pollId, optionId },
            });
            await tx.poll.update({
                where: { id: pollId },
                data: { totalVotes: { increment: 1 } },
            });
            const updatedOption = await tx.option.update({
                where: { id: optionId },
                data: { voteCount: { increment: 1 } },
            });
            return { vote, updatedOption };
        });

        const updatedPoll = await prisma.poll.findUnique({
            where: { id: pollId },
            select: { totalVotes: true },
        });

        if (!updatedPoll) {
            throw new Error("Poll not found");
        }

        return NextResponse.json({
            success: true,
            pollId,
            optionId,
            totalVotes: updatedPoll.totalVotes,
            voteCount: result.updatedOption.voteCount,
        });
    } catch (error) {
        console.error("Voting error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Failed to record vote" },
            { status: 500 }
        );
    }
};

export const POST = withPrisma(handler);