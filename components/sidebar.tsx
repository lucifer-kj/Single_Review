"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Invoices", href: "/invoices", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Templates", href: "/templates", current: false },
  { name: "Analytics", href: "/analytics", current: false },
  { name: "Settings", href: "/settings", current: false },
]

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent onClose={onClose} collapsed={false} isMobile={true} />
        </div>
      </>
    )
  }

  return (
    <div
      className={cn(
        "hidden lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-card transition-all duration-300 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30",
        collapsed ? "lg:w-20 xl:w-24" : "lg:w-72 xl:w-80 2xl:w-96",
      )}
    >
      <SidebarContent
        onClose={onClose}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobile={false}
      />
    </div>
  )
}

interface SidebarContentProps {
  onClose: () => void
  collapsed: boolean
  onToggleCollapse?: () => void
  isMobile: boolean
}

function SidebarContent({ onClose, collapsed, onToggleCollapse, isMobile }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 xl:h-20 items-center justify-between px-6 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-lg bg-primary flex items-center justify-center">
              <svg
                className="h-5 w-5 xl:h-6 xl:w-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-lg xl:text-xl font-semibold text-foreground">InvoiceFlow</span>
          </div>
        )}

        {isMobile ? (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="ml-auto">
            <svg
              className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 xl:px-6 py-6 space-y-2">
        {navigation.map((item, index) => {
          const icons = [
            <svg
              key="dashboard"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>,
            <svg key="invoices" className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>,
            <svg key="clients" className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>,
            <svg
              key="templates"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>,
            <svg
              key="analytics"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>,
            <svg key="settings" className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>,
          ]

          return (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 xl:h-12 text-base xl:text-lg",
                collapsed && "justify-center px-2",
                item.current && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {icons[index]}
              {!collapsed && <span>{item.name}</span>}
            </Button>
          )
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="border-t border-border p-4 xl:p-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm xl:text-base font-medium text-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm xl:text-base font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs xl:text-sm text-muted-foreground truncate">john@company.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
