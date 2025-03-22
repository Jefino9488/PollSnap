"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import useSWR from "swr";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MemberList } from "@/components/member-list";
import { Button } from "@/components/ui/button";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MembersPage() {
    const { data: session, status } = useSession();
    const [page, setPage] = useState(1);
    const pageSize = 10; // Number of members per page

    // Use SWR to fetch members with pagination
    const { data, error, isLoading } = useSWR(
        session ? `/api/members?page=${page}&pageSize=${pageSize}` : null,
        fetcher,
        {
            revalidateOnFocus: false, // Prevent refetching on tab switch
            revalidateOnReconnect: true, // Refetch if network reconnects
            refreshInterval: 60000, // Refresh every 60 seconds (optional)
            dedupingInterval: 30000, // Dedupe requests within 30 seconds
        }
    );

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-[#cba6f7] animate-spin" />
                    <p className="text-[#cdd6f4] text-lg">Loading members...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                Community Members
            </h1>

            {!session ? (
                <Alert className="bg-[#313244] text-[#f38ba8] border-[#f38ba8]">
                    <AlertTitle className="text-[#f38ba8] font-medium">Authentication Required</AlertTitle>
                    <AlertDescription className="text-[#f38ba8]/80">Please sign in to view community members</AlertDescription>
                </Alert>
            ) : (
                <>
                    {error ? (
                        <Alert className="bg-[#313244] text-[#f38ba8] border-[#f38ba8]">
                            <AlertTitle className="text-[#f38ba8] font-medium">Error</AlertTitle>
                            <AlertDescription className="text-[#f38ba8]/80">Failed to load members. Please try again.</AlertDescription>
                        </Alert>
                    ) : (
                        <MemberList isLoading={isLoading} members={data?.members || []} />
                    )}
                    <div className="flex justify-between mt-4">
                        <Button
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe]"
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={!data?.hasMore || isLoading}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe]"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </motion.div>
    );
}