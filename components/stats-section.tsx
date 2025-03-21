// /components/stats-section.tsx
"use client"

import { motion } from "framer-motion"
import { BarChart3, Vote, Award } from "lucide-react"

export function StatsSection({
                                 isLoading,
                                 stats,
                             }: { isLoading: boolean; stats: { pollsCreated: number; votesCast: number } }) {
    if (isLoading) {
        return <div>Loading stats...</div>
    }

    const statItems = [
        {
            title: "Polls Created",
            value: stats.pollsCreated,
            icon: <BarChart3 className="h-5 w-5" />,
            color: "from-[#cba6f7] to-[#f5c2e7]",
        },
        {
            title: "Votes Cast",
            value: stats.votesCast,
            icon: <Vote className="h-5 w-5" />,
            color: "from-[#89b4fa] to-[#89dceb]",
        },
        {
            title: "Participation Score",
            value: stats.pollsCreated + stats.votesCast,
            icon: <Award className="h-5 w-5" />,
            color: "from-[#a6e3a1] to-[#94e2d5]",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statItems.map((item, index) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#313244] rounded-xl border border-[#45475a] p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#cba6f7]"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-[#1e1e2e]`}>{item.icon}</div>
                        <div>
                            <h3 className="text-[#bac2de] text-sm font-medium">{item.title}</h3>
                            <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                {item.value}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

