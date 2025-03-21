"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Menu, LogOut, User, Vote, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Vote", icon: <Vote className="h-4 w-4 mr-2" /> },
    { href: "/members", label: "Members", icon: <Users className="h-4 w-4 mr-2" /> },
    { href: "/profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> },
  ]

  const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
  }

  return (
      <nav
          className={cn(
              "sticky top-0 z-50 bg-[#181825] border-b border-[#6c7086] py-3 transition-all duration-300",
              scrolled && "shadow-md py-2 bg-opacity-95 backdrop-blur-sm",
          )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-[#cdd6f4] text-xl font-bold flex items-center gap-2">
            <span className="text-[#cba6f7]">Poll</span>
            <span className="text-[#f5c2e7]">Snap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                      variant={pathname === link.href ? "default" : "ghost"}
                      className={cn(
                          "transition-all duration-200 flex items-center",
                          pathname === link.href
                              ? "bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe]"
                              : "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#f5c2e7]",
                      )}
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
            ))}

            {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-9 w-9 rounded-full hover:bg-[#313244]">
                      <Avatar className="h-9 w-9 border-2 border-[#cba6f7] transition-all hover:border-[#f5c2e7]">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-[#313244] text-[#cdd6f4]">
                          {session.user?.name ? getInitials(session.user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#313244] border-[#6c7086] text-[#cdd6f4]">
                    <div className="flex items-center justify-start p-2">
                      <Avatar className="h-8 w-8 mr-2 border border-[#6c7086]">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-[#45475a] text-[#cdd6f4]">
                          {session.user?.name ? getInitials(session.user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-[#cdd6f4]">{session.user?.name}</p>
                        <p className="text-xs text-[#bac2de] truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-[#45475a]" />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-[#45475a] focus:bg-[#45475a]">
                        <User className="mr-2 h-4 w-4 text-[#cba6f7]" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-[#45475a]" />
                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer text-[#f38ba8] hover:bg-[#45475a] focus:bg-[#45475a]"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    onClick={() => signIn("google")}
                    className="bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#b4befe] transition-colors"
                >
                  Sign In with Google
                </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-[#cdd6f4] hover:bg-[#313244] p-1">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                  align="end"
                  className="w-64 bg-[#313244] border-[#6c7086] text-[#cdd6f4] mt-2 rounded-xl"
              >
                {session && (
                    <>
                      <div className="flex items-center p-3 border-b border-[#45475a]">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-[#cba6f7]">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback className="bg-[#45475a] text-[#cdd6f4]">
                            {session.user?.name ? getInitials(session.user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-medium text-[#cdd6f4]">{session.user?.name}</p>
                          <p className="text-xs text-[#bac2de] truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-[#45475a]" />
                    </>
                )}

                {navLinks.map((link) => (
                    <DropdownMenuItem
                        key={link.href}
                        className={cn(
                            "py-2 cursor-pointer",
                            pathname === link.href
                                ? "bg-[#45475a] text-[#cba6f7]"
                                : "text-[#cdd6f4] hover:bg-[#45475a] focus:bg-[#45475a]",
                        )}
                        onClick={() => {
                          setIsMenuOpen(false)
                          window.location.href = link.href
                        }}
                    >
                      <div className="flex items-center">
                        {link.icon}
                        {link.label}
                      </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-[#45475a]" />

                {session ? (
                    <DropdownMenuItem
                        className="cursor-pointer text-[#f38ba8] hover:bg-[#45475a] focus:bg-[#45475a]"
                        onClick={() => {
                          setIsMenuOpen(false)
                          signOut()
                        }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        className="cursor-pointer text-[#a6e3a1] hover:bg-[#45475a] focus:bg-[#45475a]"
                        onClick={() => {
                          setIsMenuOpen(false)
                          signIn("google")
                        }}
                    >
                      <span>Sign In with Google</span>
                    </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
  )
}

