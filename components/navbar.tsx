"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LayoutDashboard, LineChart, Wallet, Lightbulb, Menu, X } from "lucide-react"

export function Navbar({ isConnected = false }: { isConnected?: boolean }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Investments", href: "/investments", icon: LineChart },
    { name: "AI Insights", href: "/insights", icon: Lightbulb },
    { name: "Wallet", href: "/wallet", icon: Wallet },
  ]

  if (pathname === "/") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="container flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#9CCD62] to-[#E0DDCA] dark:from-[#9CCD62] dark:to-[#E0DDCA]">
              Faida
            </span>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#9CCD62] to-[#E0DDCA] dark:from-[#9CCD62] dark:to-[#E0DDCA]">
              Faida
            </span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ThemeSwitcher />
          <Button variant="ghost" className="ml-2" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#9CCD62] to-[#E0DDCA] dark:from-[#9CCD62] dark:to-[#E0DDCA]">
                Faida
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

