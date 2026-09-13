import type { ComponentType, ReactNode } from "react"
import { cn } from "cn"

/**
 * Compact icon + label + value chip for summary toolbars (e.g. "Active
 * 6/10"). Designed to sit in a horizontal row above the primary content.
 */
export function MetricPill({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon?: ComponentType<{ className?: string }>
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border border-border/70 bg-card/60 px-2.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {Icon && <Icon className="size-3.5 text-muted-foreground/80" />}
      <span>{label}</span>
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
    </span>
  )
}
