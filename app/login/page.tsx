"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session, router])

    const handleSignIn = async () => {
        setIsLoading(true)
        await signIn("google", { callbackUrl: "/" })
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-[#cba6f7] animate-spin" />
                    <p className="text-[#cdd6f4] text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-[350px] bg-[#313244] border-[#45475a] text-[#cdd6f4] shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                            Welcome to PollSnap
                        </CardTitle>
                        <CardDescription className="text-center text-[#bac2de]">
                            Sign in to create and vote on polls
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#cba6f7] to-[#f5c2e7] flex items-center justify-center mb-6">
                            <LogIn className="h-8 w-8 text-[#1e1e2e]" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe] transition-colors"
                            onClick={handleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in with Google"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

