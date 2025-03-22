import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { withPrisma } from "@/lib/withPrisma";

const getHandler = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        const dbPolls = await prisma.poll.findMany({
            include: {
                createdBy: { select: { id: true, name: true } },
                options: { select: { id: true, text: true, voteCount: true } },
                votes: {
                    where: { userId },
                    select: { optionId: true },
                },
            },
        });

        const formattedPolls = dbPolls.map((poll) => ({
            id: poll.id,
            title: poll.title,
            options: poll.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
                votes: opt.voteCount,
            })),
            totalVotes: poll.totalVotes,
            isAnonymous: poll.isAnonymous,
            createdBy: { id: poll.createdBy.id, name: poll.createdBy.name || "Unknown" },
            userVoted: poll.votes.length > 0 ? poll.votes[0].optionId : null,
        }));

        return NextResponse.json(formattedPolls);
    } catch (error) {
        console.error("Failed to fetch polls:", error);
        return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
    }
};

const deleteHandler = async (request: Request) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pollId } = await request.json();
    if (!pollId) {
        return NextResponse.json({ error: "Missing pollId" }, { status: 400 });
    }

    try {
        const poll = await prisma.poll.findUnique({ where: { id: pollId } });
        if (!poll || poll.createdById !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized or poll not found" }, { status: 403 });
        }

        await prisma.poll.delete({ where: { id: pollId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete poll:", error);
        return NextResponse.json({ error: "Failed to delete poll" }, { status: 500 });
    }
};

export const GET = withPrisma(getHandler);
export const DELETE = withPrisma(deleteHandler);