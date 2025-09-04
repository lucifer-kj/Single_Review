"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const isMobile = useMobile()

  return (
    <header className="bg-background px-4 py-2 md:px-6 lg:px-8 xl:px-12">
      <div className="flex items-center justify-between mb-3">
        {/* Left side - Menu and User info */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          )}

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">JW</span>
            </div>
            <span className="font-medium text-foreground hidden sm:block">Josh Wiggins</span>
          </div>
        </div>

        {/* Right side - Action buttons moved up */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="relative max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input placeholder="Track package..." className="pl-10 pr-12 bg-muted/50 border-0 rounded-xl h-12 text-base" />
        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
        </Button>
      </div>
    </header>
  )
}
