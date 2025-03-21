import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/session-provider";
import { cleanupOldPolls } from "@/lib/prisma"; // Add import

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "PollSnap",
    description: "A modern polling application",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    if (typeof window === "undefined") {
        cleanupOldPolls();
    }

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#1e1e2e] min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <SessionProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
                </div>
            </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}