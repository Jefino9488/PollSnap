import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
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
        // Check if the user has already voted
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_pollId: {
                    userId,
                    pollId,
                },
            },
        });

        if (existingVote) {
            return NextResponse.json(
                { error: "You have already voted on this poll" },
                { status: 400 }
            );
        }

        // Perform the vote operations in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the vote
            const vote = await tx.vote.create({
                data: {
                    userId, // Now a string, satisfying Prisma's type
                    pollId,
                    optionId,
                },
            });

            // Increment poll's totalVotes
            await tx.poll.update({
                where: { id: pollId },
                data: { totalVotes: { increment: 1 } },
            });

            // Increment option's voteCount
            const updatedOption = await tx.option.update({
                where: { id: optionId },
                data: { voteCount: { increment: 1 } },
            });

            return { vote, updatedOption };
        });

        // Fetch the updated poll to get the latest totalVotes
        const updatedPoll = await prisma.poll.findUnique({
            where: { id: pollId },
            select: { totalVotes: true },
        });

        if (!updatedPoll) {
            throw new Error("Poll not found");
        }

        // Return the response with updated values
        return NextResponse.json({
            success: true,
            pollId,
            optionId,
            totalVotes: updatedPoll.totalVotes,
            voteCount: result.updatedOption.voteCount,
        });
    } catch (error) {
        console.error("Voting error:", error);
        return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
    }
}