import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const withPrisma = (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
        try {
            return await handler(req);
        } finally {
            await prisma.$disconnect();
        }
    };
};