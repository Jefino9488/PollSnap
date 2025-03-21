// /components/member-list.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Member = {
    id: string
    name: string | null
    email: string | null
    image: string | null
    createdAt: string
}

export function MemberList({ isLoading }: { isLoading: boolean }) {
    const [members, setMembers] = useState<Member[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoading) {
            fetch("/api/members")
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch members")
                    return res.json()
                })
                .then((data) => setMembers(data))
                .catch((error) => {
                    console.error("Failed to fetch members:", error)
                    setError("Failed to load members. Please try again later.")
                })
        }
    }, [isLoading])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="bg-[#313244] border-[#45475a] overflow-hidden shadow-md">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full bg-[#45475a]" />
                                <div>
                                    <Skeleton className="h-5 w-32 bg-[#45475a] mb-2" />
                                    <Skeleton className="h-4 w-24 bg-[#45475a]" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full bg-[#45475a] mb-2" />
                            <Skeleton className="h-4 w-3/4 bg-[#45475a]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="bg-[#313244] border-[#f38ba8] text-[#f38ba8]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-[#313244] rounded-xl border border-[#45475a] text-center">
                <h3 className="text-xl font-medium text-[#cdd6f4] mb-2">No members found</h3>
                <p className="text-[#bac2de]">Be the first to join the community!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
                <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="bg-[#313244] border-[#45475a] text-[#cdd6f4] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#cba6f7]">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-[#cba6f7]">
                                    <AvatarImage src={member.image || ""} alt={member.name || ""} />
                                    <AvatarFallback className="bg-[#45475a] text-[#cdd6f4] font-medium">
                                        {member.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg text-[#cdd6f4]">{member.name || "Anonymous"}</CardTitle>
                                    <Badge variant="outline" className="mt-1 bg-[#313244] border-[#45475a] text-[#bac2de] font-normal">
                                        Member
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {member.email && (
                                <div className="flex items-center text-sm text-[#bac2de]">
                                    <Mail className="h-3.5 w-3.5 mr-2 text-[#f5c2e7]" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-[#bac2de]">
                                <Calendar className="h-3.5 w-3.5 mr-2 text-[#89b4fa]" />
                                <span>
                  Joined:{" "}
                                    {new Date(member.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                </span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

