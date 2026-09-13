"use client"

import type { ComponentType } from "react"
import { cn } from "cn"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface IconRailItem {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
}

/**
 * Compact, icon-only vertical navigation rail. Each item shows its label
 * as a tooltip on hover rather than inline text, keeping the rail narrow.
 */
export function IconRail({
  items,
  activeId,
  onSelect,
  className,
}: {
  items: IconRailItem[]
  activeId?: string
  onSelect?: (id: string) => void
  className?: string
}) {
  return (
    <nav
      aria-label="Primary"
      className={cn("flex flex-col items-center gap-1 rounded-xl border border-border/70 bg-card/40 p-1.5", className)}
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = item.id === activeId
        return (
          <Tooltip key={item.id}>
            <TooltipTrigger
              onClick={() => onSelect?.(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-foreground text-background" : "hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="sr-only">{item.label}</span>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  )
}
