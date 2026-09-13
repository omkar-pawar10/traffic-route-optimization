import { cn } from "cn"

const START_ANGLE = -220
const END_ANGLE = 40
const SWEEP = END_ANGLE - START_ANGLE
const RADIUS = 42
const CENTER = 50

function polarToCartesian(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  }
}

function describeArc(radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(radius, endAngle)
  const end = polarToCartesian(radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const toneStyles = {
  success: "stroke-status-success",
  warning: "stroke-status-warning",
  critical: "stroke-status-critical",
  info: "stroke-status-info",
  neutral: "stroke-status-neutral",
} as const

export type GaugeTone = keyof typeof toneStyles

/**
 * Radial dial gauge modeled on instrument-cluster readouts (speed, fuel,
 * load). Renders a muted track arc with a tone-colored value arc and a
 * centered numeric readout.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  tone = "info",
  size = 128,
  className,
}: {
  value: number
  min?: number
  max?: number
  label?: string
  unit?: string
  tone?: GaugeTone
  size?: number
  className?: string
}) {
  const clamped = Math.min(max, Math.max(min, value))
  const fraction = (clamped - min) / (max - min || 1)
  const valueAngle = START_ANGLE + fraction * SWEEP
  const trackPath = describeArc(RADIUS, START_ANGLE, END_ANGLE)
  const valuePath = describeArc(RADIUS, START_ANGLE, valueAngle)

  return (
    <div className={cn("flex flex-col items-center gap-1", className)} style={{ width: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full"
        role="img"
        aria-label={label ? `${label}: ${clamped}${unit ?? ""}` : undefined}
      >
        <path d={trackPath} fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" className="text-border" />
        {fraction > 0 && (
          <path d={valuePath} fill="none" strokeWidth={7} strokeLinecap="round" className={toneStyles[tone]} />
        )}
        <text x="50" y="53" textAnchor="middle" className="fill-foreground text-[17px] font-semibold tabular-nums">
          {clamped}
        </text>
        {unit && (
          <text x="50" y="65" textAnchor="middle" className="fill-muted-foreground text-[7px] tracking-wide">
            {unit}
          </text>
        )}
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}
