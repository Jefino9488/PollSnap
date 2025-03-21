"use client"

import { PieChart, BarChart, Cell, ResponsiveContainer, Pie, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

type ChartData = {
    name: string
    value: number
}

type PollChartProps = {
    type: string
    data: ChartData[]
}

export function PollChart({ type, data }: PollChartProps) {
    // Catppuccin Mocha colors
    const COLORS = ["#cba6f7", "#fab387", "#a6e3a1", "#89b4fa", "#f38ba8", "#f9e2af", "#89dceb", "#94e2d5"]

    if (data.length === 0 || data.every((item) => item.value === 0)) {
        return (
            <div className="flex items-center justify-center h-full text-[#bac2de]">
                <p>No votes yet</p>
            </div>
        )
    }

    if (type === "pie") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#313244", borderColor: "#6c7086", color: "#cdd6f4" }}
                        itemStyle={{ color: "#cdd6f4" }}
                    />
                    <Legend formatter={(value) => <span style={{ color: "#bac2de" }}>{value}</span>} />
                </PieChart>
            </ResponsiveContainer>
        )
    }

    if (type === "doughnut") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#313244", borderColor: "#6c7086", color: "#cdd6f4" }}
                        itemStyle={{ color: "#cdd6f4" }}
                    />
                    <Legend formatter={(value) => <span style={{ color: "#bac2de" }}>{value}</span>} />
                </PieChart>
            </ResponsiveContainer>
        )
    }

    // Default to bar chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="name" tick={{ fill: "#bac2de" }} axisLine={{ stroke: "#6c7086" }} />
                <YAxis tick={{ fill: "#bac2de" }} axisLine={{ stroke: "#6c7086" }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#313244", borderColor: "#6c7086", color: "#cdd6f4" }}
                    itemStyle={{ color: "#cdd6f4" }}
                />
                <Bar dataKey="value">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

