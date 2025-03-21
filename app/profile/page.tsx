"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatsSection } from "@/components/stats-section"
import { UserPollList } from "@/components/user-poll-list"
import { CreatePollForm } from "@/components/create-poll-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ProfileData = {
    name: string | null
    email: string | null
    image: string | null
    createdPolls: {
        id: string
        title: string
        totalVotes: number
        options: { id: string; text: string; voteCount: number }[]
    }[]
    votesCast: { pollId: string; pollTitle: string; optionId: string; optionText: string; createdAt: string }[]
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchProfileData = async () => {
        try {
            setError(null)
            const response = await fetch("/api/profile")
            if (!response.ok) throw new Error("Failed to fetch profile data")
            const data = await response.json()
            setProfileData(data)
        } catch (error) {
            console.error("Failed to fetch profile data:", error)
            setError("Failed to load profile data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) {
            fetchProfileData()
            const interval = setInterval(fetchProfileData, 5000)
            return () => clearInterval(interval)
        }
    }, [session])

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch("/api/profile", { method: "DELETE" })
            if (response.ok) {
                signOut({ callbackUrl: "/login" })
            } else {
                throw new Error("Failed to delete account")
            }
        } catch (error) {
            console.error("Delete account error:", error)
            setError("Failed to delete account. Please try again later.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (status === "loading" || (loading && !profileData)) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-[#cba6f7] animate-spin" />
                    <p className="text-[#cdd6f4] text-lg">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                    My Profile
                </h1>
                <Alert className="bg-[#313244] text-[#f38ba8] border-[#f38ba8]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-[#f38ba8] font-medium">Authentication Required</AlertTitle>
                    <AlertDescription className="text-[#f38ba8]/80">Please sign in to view your profile</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                    My Profile
                </h1>
                <Alert className="bg-[#313244] text-[#f38ba8] border-[#f38ba8]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-[#f38ba8] font-medium">Error</AlertTitle>
                    <AlertDescription className="text-[#f38ba8]/80">{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!profileData) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-[#313244] p-6 rounded-xl border border-[#45475a] shadow-md">
                <Avatar className="h-20 w-20 border-4 border-[#cba6f7]">
                    <AvatarImage src={profileData.image || ""} alt={profileData.name || ""} />
                    <AvatarFallback className="bg-[#45475a] text-[#cdd6f4] text-2xl">
                        {profileData.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[#cdd6f4]">{profileData.name}</h1>
                    <p className="text-[#bac2de]">{profileData.email}</p>
                </div>
            </div>

            <StatsSection
                isLoading={false}
                stats={{
                    pollsCreated: profileData.createdPolls.length,
                    votesCast: profileData.votesCast.length,
                }}
            />

            <Tabs defaultValue="polls" className="w-full">
                <TabsList className="bg-[#313244] border border-[#45475a] p-1">
                    <TabsTrigger value="polls" className="data-[state=active]:bg-[#45475a] data-[state=active]:text-[#cba6f7]">
                        My Polls
                    </TabsTrigger>
                    <TabsTrigger value="votes" className="data-[state=active]:bg-[#45475a] data-[state=active]:text-[#cba6f7]">
                        My Votes
                    </TabsTrigger>
                    <TabsTrigger value="create" className="data-[state=active]:bg-[#45475a] data-[state=active]:text-[#cba6f7]">
                        Create Poll
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-[#45475a] data-[state=active]:text-[#cba6f7]">
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="polls" className="mt-4">
                    <UserPollList polls={profileData.createdPolls} isLoading={false} />
                </TabsContent>

                <TabsContent value="votes" className="mt-4">
                    <div className="bg-[#313244] rounded-xl border border-[#45475a] p-6">
                        <h2 className="text-xl font-bold text-[#cdd6f4] mb-4">Votes Cast</h2>
                        {profileData.votesCast.length === 0 ? (
                            <p className="text-[#bac2de] text-center py-4">You haven&#39;t cast any votes yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {profileData.votesCast.map((vote) => (
                                    <motion.div
                                        key={vote.optionId}
                                        className="bg-[#45475a] p-4 rounded-lg border border-[#6c7086]"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-[#cdd6f4]">
                                            Voted <span className="font-medium text-[#a6e3a1]">{vote.optionText}</span> in poll{" "}
                                            <span className="font-medium text-[#cba6f7]">&#34;{vote.pollTitle}&#34;</span>
                                        </p>
                                        <p className="text-sm text-[#bac2de] mt-1">{new Date(vote.createdAt).toLocaleString()}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="create" className="mt-4">
                    <CreatePollForm />
                </TabsContent>

                <TabsContent value="settings" className="mt-4">
                    <div className="bg-[#313244] rounded-xl border border-[#45475a] p-6">
                        <h2 className="text-xl font-bold text-[#cdd6f4] mb-4">Account Settings</h2>
                        <Separator className="my-4 bg-[#45475a]" />

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-[#f38ba8]">Danger Zone</h3>
                                <p className="text-sm text-[#bac2de] mt-1">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#f38ba8]/90 flex items-center"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#313244] border-[#45475a] text-[#cdd6f4]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-[#f38ba8]">Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-[#bac2de]">
                                            This action cannot be undone. This will permanently delete your account and remove all your data
                                            from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-[#45475a] text-[#cdd6f4] hover:bg-[#6c7086] hover:text-[#cdd6f4]">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#f38ba8]/90"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete Account"
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}

