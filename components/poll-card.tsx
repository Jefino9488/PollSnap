"use client"

import {JSX, useState} from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import useSWR from "swr"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Loader2, User, Lock, CheckCircle2 } from "lucide-react"

interface Option {
    id: string
    text: string
    votes: number
}

interface Poll {
    id: string
    title: string
    options: Option[]
    totalVotes: number
    isAnonymous: boolean
    createdBy: { id: string; name: string }
    userVoted?: string | null
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// ProgressBar component with explicit props type
interface ProgressBarProps {
    value: number
    max: number
    isSelected: boolean
}

function ProgressBar({ value, max, isSelected }: ProgressBarProps) {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0

    return (
        <div className="w-full bg-[#45475a] rounded-full h-2.5 mt-1 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "h-2.5 rounded-full",
                    isSelected ? "bg-[#cba6f7]" : "bg-[#94e2d5]",
                    percentage === 0 && "bg-[#6c7086]"
                )}
            />
        </div>
    )
}

interface PollCardProps {
    poll: Poll
}

export function PollCard({ poll }: PollCardProps): JSX.Element {
    const { data: session } = useSession()
    const [selectedOption, setSelectedOption] = useState<string | null>(poll.userVoted || null)
    const [isVoting, setIsVoting] = useState(false)

    // Fetch vote data every 10 seconds using SWR
    const { data: voteData } = useSWR<Poll>(
        `/api/polls?votePollId=${poll.id}`,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
            fallbackData: poll,
        }
    )

    const pollData = voteData || poll // Use fetched data if available, fallback to initial poll

    const handleVote = async () => {
        if (!session) {
            toast.error("Please sign in to vote")
            return
        }
        if (!selectedOption || poll.userVoted) return

        setIsVoting(true)
        try {
            const response = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pollId: poll.id, optionId: selectedOption }),
            })

            if (!response.ok) throw new Error("Failed to vote")
            toast.success("Your vote has been recorded!", {
                description: "Thank you for participating!",
                icon: <CheckCircle2 className="h-4 w-4 text-[#a6e3a1]" />,
            })
        } catch (error) {
            console.error("Voting error:", error)
            toast.error("Failed to record your vote", {
                description: "Please try again later",
            })
        } finally {
            setIsVoting(false)
        }
    }

    return (
        <Card className="bg-[#313244] border-[#45475a] text-[#cdd6f4] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#cba6f7]">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-[#cdd6f4]">{pollData.title}</CardTitle>
                    {pollData.isAnonymous && (
                        <Badge variant="outline" className="bg-[#313244] border-[#f5c2e7] text-[#f5c2e7] flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>Anonymous</span>
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-[#bac2de] flex items-center mt-1">
                    <User className="h-3 w-3 mr-1 inline" />
                    {pollData.isAnonymous ? "Anonymous" : pollData.createdBy.name}
                </p>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedOption || ""}
                    onValueChange={setSelectedOption}
                    disabled={!!pollData.userVoted || isVoting}
                    className="space-y-3"
                >
                    {pollData.options.map((option) => {
                        const percentage = pollData.totalVotes > 0 ? Math.round((option.votes / pollData.totalVotes) * 100) : 0
                        const isSelected = option.id === selectedOption || option.id === pollData.userVoted

                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    "space-y-1 rounded-lg p-2 transition-all",
                                    isSelected ? "bg-[#45475a]/50" : "hover:bg-[#45475a]/30",
                                    pollData.userVoted && "cursor-default"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                        <RadioGroupItem value={option.id} id={option.id} className="border-[#cba6f7] text-[#cba6f7]" />
                                        <Label
                                            htmlFor={option.id}
                                            className={cn(
                                                "flex-1 cursor-pointer font-medium",
                                                isSelected ? "text-[#cdd6f4]" : "text-[#bac2de]"
                                            )}
                                        >
                                            {option.text}
                                        </Label>
                                    </div>
                                    {pollData.userVoted && (
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "ml-2 border-[#45475a] bg-[#313244]",
                                                isSelected ? "text-[#cba6f7]" : "text-[#bac2de]"
                                            )}
                                        >
                                            {percentage}%
                                        </Badge>
                                    )}
                                </div>
                                {pollData.userVoted && <ProgressBar value={option.votes} max={pollData.totalVotes} isSelected={isSelected} />}
                            </div>
                        )
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[#45475a] pt-3">
                <Badge variant="outline" className="bg-[#313244] border-[#45475a] text-[#bac2de]">
                    {pollData.totalVotes} {pollData.totalVotes === 1 ? "vote" : "votes"}
                </Badge>
                {!pollData.userVoted && (
                    <Button
                        onClick={handleVote}
                        disabled={!selectedOption || isVoting}
                        className={cn(
                            "transition-all",
                            isVoting ? "bg-[#45475a] text-[#bac2de]" : "bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe]"
                        )}
                    >
                        {isVoting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Voting...
                            </>
                        ) : (
                            "Vote"
                        )}
                    </Button>
                )}
                {pollData.userVoted && (
                    <Badge className="bg-[#a6e3a1] text-[#1e1e2e] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Voted</span>
                    </Badge>
                )}
            </CardFooter>
        </Card>
    )
}