"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2, Vote, BarChart, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function LandingPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        await signIn("google", { callbackUrl: "/" })
    }

    const features = [
        {
            icon: <Vote className="h-8 w-8 text-[#cba6f7]" />,
            title: "Create & Vote on Polls",
            description: "Create polls on any topic and gather opinions from the community",
        },
        {
            icon: <BarChart className="h-8 w-8 text-[#f5c2e7]" />,
            title: "Visualize Results",
            description: "See real-time results with beautiful charts and analytics",
        },
        {
            icon: <Users className="h-8 w-8 text-[#89b4fa]" />,
            title: "Connect with Others",
            description: "Discover what others think and engage with the community",
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-[#a6e3a1]" />,
            title: "Anonymous Voting",
            description: "Create anonymous polls for sensitive topics or honest feedback",
        },
    ]

    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 mt-8"
            >
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#cba6f7] via-[#f5c2e7] to-[#89b4fa] bg-clip-text text-transparent">
                    Welcome to PollSnap
                </h1>
                <p className="text-xl text-[#bac2de] max-w-2xl mx-auto">
                    Create polls, gather opinions, and visualize results in real-time
                </p>
                <Button
                    onClick={handleSignIn}
                    size="lg"
                    className="mt-8 bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe] transition-colors text-lg px-8 py-6"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Get Started with Google"
                    )}
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-16">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                        <Card className="bg-[#313244] border-[#45475a] text-[#cdd6f4] h-full hover:border-[#cba6f7] transition-all">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="p-3 rounded-full bg-[#1e1e2e] mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-[#cdd6f4]">{feature.title}</h3>
                                <p className="text-[#bac2de]">{feature.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full max-w-6xl bg-[#313244] rounded-xl border border-[#45475a] p-8 mb-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4 text-[#cdd6f4]">How It Works</h2>
                        <ol className="space-y-4">
                            <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#cba6f7] text-[#1e1e2e] font-bold mr-3">
                  1
                </span>
                                <div>
                                    <h3 className="font-medium text-[#cdd6f4]">Sign in with your Google account</h3>
                                    <p className="text-[#bac2de] text-sm">Quick and secure authentication</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#f5c2e7] text-[#1e1e2e] font-bold mr-3">
                  2
                </span>
                                <div>
                                    <h3 className="font-medium text-[#cdd6f4]">Create your first poll</h3>
                                    <p className="text-[#bac2de] text-sm">Add a title, options, and choose settings</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#89b4fa] text-[#1e1e2e] font-bold mr-3">
                  3
                </span>
                                <div>
                                    <h3 className="font-medium text-[#cdd6f4]">Share with others</h3>
                                    <p className="text-[#bac2de] text-sm">Let the community vote on your polls</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#a6e3a1] text-[#1e1e2e] font-bold mr-3">
                  4
                </span>
                                <div>
                                    <h3 className="font-medium text-[#cdd6f4]">Analyze results</h3>
                                    <p className="text-[#bac2de] text-sm">View detailed charts and statistics</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={handleSignIn}
                            size="lg"
                            className="bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] text-[#1e1e2e] hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in to Start"
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

