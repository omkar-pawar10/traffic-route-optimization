"use client"

import { cn } from "cn"

export interface FilterPillOption {
  value: string
  label: string
  count?: number
}

/**
 * Segmented, pill-shaped filter control with per-option counts (e.g. "All
 * 10 / Active 6 / Idle 2"). A lighter-weight alternative to Tabs for
 * status-driven list filtering.
 */
export function FilterPills({
  options,
  value,
  onValueChange,
  className,
}: {
  options: FilterPillOption[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter"
      className={cn("inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/40 p-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] tabular-nums",
                  active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
