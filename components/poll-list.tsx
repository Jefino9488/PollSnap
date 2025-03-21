// /components/poll-list.tsx
"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { PollCard } from "@/components/poll-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type Option = {
  id: string
  text: string
  votes: number
}

type Poll = {
  id: string
  title: string
  options: Option[]
  totalVotes: number
  isAnonymous: boolean
  createdBy: { id: string; name: string }
  userVoted?: string | null
}

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPolls = async () => {
    try {
      setError(null)
      const response = await fetch("/api/polls")
      if (!response.ok) throw new Error("Failed to fetch polls")
      const data = await response.json()
      setPolls(data)
    } catch (error) {
      console.error("Failed to fetch polls:", error)
      setError("Failed to load polls. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchPolls, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#313244] rounded-xl border border-[#45475a] overflow-hidden shadow-md">
                <div className="p-5">
                  <Skeleton className="h-7 w-3/4 bg-[#45475a] mb-4" />
                  <Skeleton className="h-4 w-1/2 bg-[#45475a] mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full bg-[#45475a]" />
                            <Skeleton className="h-5 w-full bg-[#45475a]" />
                          </div>
                          <Skeleton className="h-2 w-full bg-[#45475a]" />
                        </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#45475a] p-4 flex justify-between">
                  <Skeleton className="h-5 w-24 bg-[#45475a]" />
                  <Skeleton className="h-9 w-20 bg-[#45475a] rounded-md" />
                </div>
              </div>
          ))}
        </div>
    )
  }

  if (error) {
    return (
        <Alert variant="destructive" className="bg-[#313244] border-[#f38ba8] text-[#f38ba8]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (polls.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-[#313244] rounded-xl border border-[#45475a] text-center">
          <div className="text-[#cba6f7] mb-4 p-4 rounded-full bg-[#45475a]/30">
            <Loader2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-medium text-[#cdd6f4] mb-2">No polls yet</h3>
          <p className="text-[#bac2de]">Be the first to create a poll!</p>
        </div>
    )
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll, index) => (
            <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PollCard poll={poll} />
            </motion.div>
        ))}
      </div>
  )
}

