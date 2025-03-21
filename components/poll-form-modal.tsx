"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { X, Plus, Loader2, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type PollFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PollFormModal({ open, onOpenChange }: PollFormModalProps) {
  const { data: session } = useSession()
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      setOptions(newOptions)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!session) {
      toast.error("Please sign in to create a poll")
      return
    }

    if (!title.trim()) {
      toast.error("Please enter a poll title")
      return
    }

    const validOptions = options.filter((opt) => opt.trim() !== "")
    if (validOptions.length < 2) {
      toast.error("Please add at least two options")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/polls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, options: validOptions, isAnonymous }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || "Failed to create poll")
      }

      toast.success("Poll created successfully!")
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Poll creation error:", error)
      toast.error("Failed to create poll")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setOptions(["", ""])
    setIsAnonymous(false)
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#313244] border-[#45475a] text-[#cdd6f4] sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#cdd6f4]">Create New Poll</DialogTitle>
            <DialogDescription className="text-[#bac2de]">
              Create a poll to gather opinions from the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#cdd6f4] font-medium">
                Poll Title
              </Label>
              <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your question"
                  className="bg-[#45475a] border-[#6c7086] text-[#cdd6f4] placeholder:text-[#7f849c] focus:border-[#cba6f7] focus:ring-[#cba6f7]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#cdd6f4] font-medium">Options</Label>
                <span className="text-xs text-[#7f849c]">{options.length}/10 options</span>
              </div>
              <AnimatePresence>
                {options.map((option, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                      <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="bg-[#45475a] border-[#6c7086] text-[#cdd6f4] placeholder:text-[#7f849c] focus:border-[#cba6f7] focus:ring-[#cba6f7]"
                      />
                      {options.length > 2 && (
                          <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(index)}
                              className="text-[#f38ba8] hover:text-[#f38ba8] hover:bg-[#45475a]"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                      )}
                    </motion.div>
                ))}
              </AnimatePresence>

              {options.length < 10 && (
                  <Button
                      type="button"
                      onClick={handleAddOption}
                      variant="outline"
                      className="w-full mt-2 border-dashed border-[#6c7086] text-[#bac2de] hover:bg-[#45475a] hover:text-[#cdd6f4]"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="data-[state=checked]:bg-[#cba6f7]"
              />
              <Label htmlFor="anonymous" className="text-[#cdd6f4] flex items-center">
                Anonymous Poll
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 ml-1 text-[#7f849c]" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#45475a] text-[#cdd6f4] border-[#6c7086]">
                      Your name won't be shown as the poll creator
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-[#6c7086] text-[#cdd6f4] hover:bg-[#45475a] hover:text-[#f5c2e7]"
            >
              Cancel
            </Button>
            <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe]"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
              ) : (
                  "Create Poll"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

