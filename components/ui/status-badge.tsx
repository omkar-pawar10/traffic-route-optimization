import type { ReactNode } from "react"
import { cn } from "cn"

const statusStyles = {
  success: "bg-status-success/10 text-status-success border-status-success/25",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/25",
  critical: "bg-status-critical/10 text-status-critical border-status-critical/25",
  info: "bg-status-info/10 text-status-info border-status-info/25",
  neutral: "bg-status-neutral/10 text-status-neutral border-status-neutral/25",
} as const

export type StatusTone = keyof typeof statusStyles

/**
 * Compact status indicator used across list rows, cards, and detail
 * headers to communicate operational state (active, idle, offline, risk
 * level, etc.) with a muted, low-saturation tint rather than a solid fill.
 */
export function StatusBadge({
  tone,
  children,
  className,
  showDot = true,
}: {
  tone: StatusTone
  children: ReactNode
  className?: string
  showDot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium leading-none tracking-tight whitespace-nowrap",
        statusStyles[tone],
        className,
      )}
    >
      {showDot && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
