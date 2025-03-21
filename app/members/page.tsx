"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MemberList } from "@/components/member-list"

export default function MembersPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (status === "loading") {
    return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-[#cba6f7] animate-spin" />
            <p className="text-[#cdd6f4] text-lg">Loading members...</p>
          </div>
        </div>
    )
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
            <MemberList isLoading={loading} />
        )}
      </motion.div>
  )
}

