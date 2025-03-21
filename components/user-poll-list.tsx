"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, BarChart, PieChart, DonutIcon as Doughnut, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PollChart } from "@/components/poll-chart"

type Poll = {
  id: string
  title: string
  totalVotes: number
  options: { id: string; text: string; voteCount: number }[]
}

export function UserPollList({ polls, isLoading }: { polls: Poll[]; isLoading: boolean }) {
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null)
  const [chartTypes, setChartTypes] = useState<Record<string, string>>({})

  const handleDelete = async (pollId: string) => {
    setDeletingPollId(pollId)
    try {
      const response = await fetch("/api/polls", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete poll")
      }
      window.location.reload() // Refresh to update the list
    } catch (error) {
      console.error("Delete poll error:", error)
      alert("Failed to delete poll.")
    } finally {
      setDeletingPollId(null)
    }
  }

  const getChartType = (pollId: string) => {
    return chartTypes[pollId] || "pie"
  }

  const setChartType = (pollId: string, type: string) => {
    setChartTypes((prev) => ({
      ...prev,
      [pollId]: type,
    }))
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-[#cba6f7] animate-spin" />
        </div>
    )
  }

  if (polls.length === 0) {
    return (
        <div className="bg-[#313244] rounded-xl border border-[#45475a] p-6 text-center">
          <h3 className="text-lg font-medium text-[#cdd6f4] mb-2">No polls created yet</h3>
          <p className="text-[#bac2de]">Create your first poll to see it here!</p>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {polls.map((poll, index) => (
            <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-[#313244] border-[#45475a] text-[#cdd6f4] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#cba6f7]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-[#cdd6f4]">{poll.title}</CardTitle>
                    <Badge variant="outline" className="bg-[#313244] border-[#45475a] text-[#bac2de]">
                      {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-[#bac2de]">Results Visualization</h3>
                    <Select value={getChartType(poll.id)} onValueChange={(value) => setChartType(poll.id, value)}>
                      <SelectTrigger className="w-32 bg-[#45475a] border-[#6c7086] text-[#cdd6f4]">
                        <SelectValue placeholder="Chart Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#313244] border-[#6c7086] text-[#cdd6f4]">
                        <SelectItem value="pie" className="focus:bg-[#45475a] focus:text-[#cdd6f4]">
                          <div className="flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-[#cba6f7]" />
                            <span>Pie Chart</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bar" className="focus:bg-[#45475a] focus:text-[#cdd6f4]">
                          <div className="flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-[#89b4fa]" />
                            <span>Bar Chart</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="doughnut" className="focus:bg-[#45475a] focus:text-[#cdd6f4]">
                          <div className="flex items-center">
                            <Doughnut className="h-4 w-4 mr-2 text-[#94e2d5]" />
                            <span>Doughnut</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-[#45475a] rounded-lg p-4 h-64 flex items-center justify-center">
                    <PollChart
                        type={getChartType(poll.id)}
                        data={poll.options.map((option) => ({
                          name: option.text,
                          value: option.voteCount,
                        }))}
                    />
                  </div>

                  <Tabs defaultValue="results" className="w-full">
                    <TabsList className="bg-[#45475a] w-full">
                      <TabsTrigger
                          value="results"
                          className="flex-1 data-[state=active]:bg-[#313244] data-[state=active]:text-[#cba6f7]"
                      >
                        Results
                      </TabsTrigger>
                      <TabsTrigger
                          value="options"
                          className="flex-1 data-[state=active]:bg-[#313244] data-[state=active]:text-[#cba6f7]"
                      >
                        Options
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="results" className="mt-2">
                      <div className="space-y-1">
                        {poll.options.map((option) => {
                          const percentage =
                              poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0

                          return (
                              <div key={option.id} className="flex justify-between items-center">
                                <span className="text-[#bac2de] truncate max-w-[70%]">{option.text}</span>
                                <Badge variant="outline" className="bg-[#313244] border-[#45475a] text-[#cba6f7]">
                                  {option.voteCount} ({percentage}%)
                                </Badge>
                              </div>
                          )
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="options" className="mt-2">
                      <div className="space-y-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#f38ba8]/90 flex items-center justify-center"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Poll
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#313244] border-[#45475a] text-[#cdd6f4]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#f38ba8]">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-[#bac2de]">
                                This action cannot be undone. This will permanently delete your poll and all associated
                                votes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#45475a] text-[#cdd6f4] hover:bg-[#6c7086] hover:text-[#cdd6f4]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                  onClick={() => handleDelete(poll.id)}
                                  className="bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#f38ba8]/90"
                              >
                                {deletingPollId === poll.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                ) : (
                                    "Delete Poll"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
        ))}
      </div>
  )
}

