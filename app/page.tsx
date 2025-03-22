"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { PollList } from "@/components/poll-list"
import { PollFormModal } from "@/components/poll-form-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { LandingPage } from "@/components/landing-page"

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VotePage() {
    const { data: session, status } = useSession()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Fetch poll list every 25 seconds using SWR
    const { data: polls, error: pollError } = useSWR(
        session ? "/api/polls" : null,
        fetcher,
        {
            refreshInterval: 25000, // Refresh every 25 seconds (balanced between 20-30s)
            revalidateOnFocus: false, // Prevent refetch on tab switch
            revalidateOnReconnect: true, // Refetch if network reconnects
            dedupingInterval: 20000, // Dedupe requests within 20 seconds
        }
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48 bg-[#313244]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full bg-[#313244] rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-[#cba6f7] animate-spin" />
                    <p className="text-[#cdd6f4] text-lg">Loading polls...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return <LandingPage />
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[#cdd6f4] bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text">
                        Vote Feed
                    </h1>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe] transition-colors hidden md:flex"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Poll
                    </Button>
                </div>

                <PollList polls={polls} isLoading={!polls && !pollError} />

                <motion.div className="fixed bottom-6 right-6 md:hidden" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-full w-14 h-14 bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe] shadow-lg"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </motion.div>

                <PollFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
            </motion.div>
        </AnimatePresence>
    )
}