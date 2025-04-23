"use client"

import type React from "react"

import { useEffect } from "react"
import { BarChart3, LayoutDashboard, MessageSquare, Search, Settings, HelpCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Internal component to handle sidebar state based on screen size
function SidebarController() {
  const { setOpen } = useSidebar()
  const isLargeScreen = useMediaQuery("(min-width: 1280px)")

  useEffect(() => {
    // Collapse sidebar when screen width is 1280px or less
    setOpen(isLargeScreen)
  }, [isLargeScreen, setOpen])

  return null
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Ask AI",
      icon: MessageSquare,
      href: "/dashboard/ask",
    },
    {
      title: "Search",
      icon: Search,
      href: "/dashboard/search",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  const isAskPage = pathname === "/dashboard/ask"

  return (
    <SidebarProvider>
      <SidebarController />
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-xl font-semibold">Gemini Chat</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/help">
                        <HelpCircle className="h-5 w-5" />
                        <span>Help & Documentation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-full flex-col">
            {!isAskPage && (
              <header className="flex h-16 items-center gap-4 border-b px-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold">
                    {menuItems.find((item) => item.href === pathname)?.title || "Dashboard"}
                  </h1>
                </div>
              </header>
            )}
            <main className={`flex-1 overflow-auto ${isAskPage ? "p-0" : "p-6"} w-full min-w-0`}>
              {isAskPage ? (
                <div className="flex h-16 items-center gap-4 px-6 border-b">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-semibold">Ask AI</h1>
                  </div>
                </div>
              ) : null}
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
