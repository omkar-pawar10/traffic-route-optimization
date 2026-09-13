'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  VIEWBOX,
  congestionColorVar,
  incidents,
  junctions,
  restrictionMarkers,
  roadClassWidth,
  roads,
  toPathD,
  vehicleColorVar,
  vehicleRoutes,
  type VehicleClass,
} from '@/lib/traffic-network'

type Selection = VehicleClass | 'all'

interface TrafficMapProps {
  className?: string
  initialSelection?: Selection
  /** show the vehicle-class selector strip */
  selectable?: boolean
  /** controlled selection — when provided, the parent owns the highlighted route */
  selection?: Selection
  onSelectionChange?: (selection: Selection) => void
  showLegend?: boolean
  showFocusCard?: boolean
  showHint?: boolean
  /** fill the parent's height instead of using a fixed aspect ratio */
  fill?: boolean
}

const MIN_SCALE = 0.6
const MAX_SCALE = 4.5

const selectionOrder: Selection[] = ['all', 'emergency', 'freight', 'passenger', 'two-wheeler']

export function TrafficMap({
  className,
  initialSelection = 'all',
  selectable = true,
  selection: controlledSelection,
  onSelectionChange,
  showLegend = true,
  showFocusCard = true,
  showHint = true,
  fill = false,
}: TrafficMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 })
  const [internalSelection, setInternalSelection] = useState<Selection>(initialSelection)
  const selection = controlledSelection ?? internalSelection
  const setSelection = useCallback(
    (next: Selection) => {
      onSelectionChange?.(next)
      if (controlledSelection === undefined) setInternalSelection(next)
    },
    [controlledSelection, onSelectionChange],
  )
  const dragState = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)

  const clientToRatio = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    // account for xMidYMid meet letterboxing so zoom stays anchored under the cursor
    const scaleFit = Math.min(rect.width / VIEWBOX.width, rect.height / VIEWBOX.height)
    const drawnW = VIEWBOX.width * scaleFit
    const drawnH = VIEWBOX.height * scaleFit
    const offsetX = (rect.width - drawnW) / 2
    const offsetY = (rect.height - drawnH) / 2
    return {
      x: (clientX - rect.left - offsetX) / scaleFit,
      y: (clientY - rect.top - offsetY) / scaleFit,
    }
  }, [])

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setView((v) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor))
        const applied = next / v.scale
        // keep the point (cx,cy) fixed on screen
        const tx = cx - (cx - v.tx) * applied
        const ty = cy - (cy - v.ty) * applied
        return { scale: next, tx, ty }
      })
    },
    [],
  )

  // non-passive wheel listener so we can prevent the page from scrolling
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { x, y } = clientToRatio(e.clientX, e.clientY)
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, x, y)
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [clientToRatio, zoomAt])

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragState.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty }
  }
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const d = dragState.current
    if (!d) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scaleFit = Math.min(rect.width / VIEWBOX.width, rect.height / VIEWBOX.height)
    setView((v) => ({
      ...v,
      tx: d.tx + (e.clientX - d.x) / scaleFit,
      ty: d.ty + (e.clientY - d.y) / scaleFit,
    }))
  }
  const endPan = () => {
    dragState.current = null
  }

  const reset = () => setView({ scale: 1, tx: 0, ty: 0 })
  const zoomButton = (factor: number) => zoomAt(factor, VIEWBOX.width / 2, VIEWBOX.height / 2)

  const activeRoutes = useMemo(
    () => (selection === 'all' ? vehicleRoutes : vehicleRoutes.filter((r) => r.vehicle === selection)),
    [selection],
  )
  const focused = selection !== 'all' ? vehicleRoutes.find((r) => r.vehicle === selection) : null

  return (
    <div className={cn('flex flex-col gap-3', fill && 'h-full gap-0', className)}>
      {selectable && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Highlight vehicle-class route">
          {selectionOrder.map((key) => {
            const active = selection === key
            const label = key === 'all' ? 'All routes' : vehicleRoutes.find((r) => r.vehicle === key)?.label
            const dot = key === 'all' ? null : vehicleColorVar[key as VehicleClass]
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelection(key)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-border bg-secondary text-foreground'
                    : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {dot && <span className="size-2 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />}
                {label}
              </button>
            )
          })}
        </div>
      )}

      <div className={cn('relative overflow-hidden border border-border bg-surface-sunken', fill ? 'h-full rounded-none' : 'rounded-lg')}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid meet"
          className={cn('block w-full cursor-grab touch-none active:cursor-grabbing', fill ? 'h-full' : 'aspect-[1200/820]')}
          role="img"
          aria-label="Simulated demonstration road network with vehicle-class routes and restrictions"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPan}
          onPointerLeave={endPan}
          onPointerCancel={endPan}
        >
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e0e0e" strokeWidth="1" />
            </pattern>
          </defs>

          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
            {/* base */}
            <rect x={-200} y={-200} width={VIEWBOX.width + 400} height={VIEWBOX.height + 400} fill="#000000" />
            <rect x={0} y={0} width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#map-grid)" />

            {/* land parcels for map texture */}
            <g fill="#0b0b0b" stroke="#141414" strokeWidth={1}>
              <rect x={520} y={300} width={180} height={120} rx={4} />
              <rect x={720} y={200} width={150} height={130} rx={4} />
              <rect x={300} y={430} width={130} height={130} rx={4} />
              <rect x={560} y={560} width={150} height={120} rx={4} />
              <rect x={840} y={330} width={120} height={90} rx={4} />
            </g>

            {/* road casings (drawn first, wider + dark) */}
            {roads.map((r) => (
              <path
                key={`case-${r.id}`}
                d={toPathD(r.points)}
                fill="none"
                stroke="#050505"
                strokeWidth={roadClassWidth[r.roadClass] + 4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* road surface */}
            {roads.map((r) => {
              const surface = r.restricted
                ? '#2a2320'
                : r.roadClass === 'major'
                  ? '#3d3d3d'
                  : r.roadClass === 'secondary'
                    ? '#323232'
                    : '#262626'
              return (
                <path
                  key={`road-${r.id}`}
                  d={toPathD(r.points)}
                  fill="none"
                  stroke={surface}
                  strokeWidth={roadClassWidth[r.roadClass]}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={r.restricted ? '2 7' : undefined}
                >
                  <title>{`${r.name}${r.restriction?.note ? ` — ${r.restriction.note}` : ''}`}</title>
                </path>
              )
            })}

            {/* flyover casing accent (double edge) */}
            {roads
              .filter((r) => r.flyover)
              .map((r) => (
                <path
                  key={`fly-${r.id}`}
                  d={toPathD(r.points)}
                  fill="none"
                  stroke="#5a5a5a"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}

            {/* congestion overlays */}
            {roads
              .filter((r) => r.congestion && r.congestion !== 'free')
              .map((r) => (
                <path
                  key={`cong-${r.id}`}
                  d={toPathD(r.points)}
                  fill="none"
                  stroke={congestionColorVar[r.congestion as 'moderate' | 'heavy']}
                  strokeWidth={r.congestion === 'heavy' ? 3 : 2}
                  strokeLinecap="round"
                  strokeDasharray={r.congestion === 'heavy' ? '10 8' : '4 10'}
                  opacity={0.85}
                />
              ))}

            {/* routes */}
            {activeRoutes.map((route) => {
              const dimmed = selection === 'all'
              return (
                <g key={`route-${route.vehicle}`}>
                  <path
                    d={toPathD(route.points)}
                    fill="none"
                    stroke={vehicleColorVar[route.vehicle]}
                    strokeWidth={focused ? 5 : 3.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity={dimmed ? 0.9 : 1}
                    style={{ filter: focused ? 'none' : undefined }}
                  />
                </g>
              )
            })}

            {/* junctions */}
            {junctions.map((j) => {
              const isEndpoint = j.kind === 'depot' || j.kind === 'destination'
              const isFlyover = j.kind === 'flyover'
              return (
                <g key={j.id}>
                  {isEndpoint ? (
                    <>
                      <circle cx={j.x} cy={j.y} r={9} fill="#050505" stroke="#f2f2f2" strokeWidth={2} />
                      <circle
                        cx={j.x}
                        cy={j.y}
                        r={4}
                        fill={j.kind === 'depot' ? 'var(--status-info)' : 'var(--status-success)'}
                      />
                    </>
                  ) : (
                    <circle
                      cx={j.x}
                      cy={j.y}
                      r={isFlyover ? 5 : 4}
                      fill="#0a0a0a"
                      stroke={isFlyover ? '#7a7a7a' : '#4a4a4a'}
                      strokeWidth={1.5}
                    />
                  )}
                  <text
                    x={j.x}
                    y={j.y + (j.labelDy ?? -12)}
                    textAnchor={j.anchor ?? 'middle'}
                    fontSize={13}
                    fontWeight={isEndpoint ? 600 : 500}
                    fill={isEndpoint ? '#f2f2f2' : '#9a9a9a'}
                    stroke="#000000"
                    strokeWidth={3}
                    paintOrder="stroke"
                    style={{ pointerEvents: 'none' }}
                  >
                    {j.name}
                  </text>
                </g>
              )
            })}

            {/* incidents */}
            {incidents.map((inc) => (
              <g key={inc.id}>
                <circle cx={inc.x} cy={inc.y} r={11} fill="#050505" stroke="var(--status-critical)" strokeWidth={1.5} />
                {inc.kind === 'accident' && (
                  <path
                    d={`M ${inc.x - 4} ${inc.y - 4} L ${inc.x + 4} ${inc.y + 4} M ${inc.x + 4} ${inc.y - 4} L ${inc.x - 4} ${inc.y + 4}`}
                    stroke="var(--status-critical)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                )}
                {inc.kind === 'roadwork' && (
                  <path
                    d={`M ${inc.x - 5} ${inc.y + 4} L ${inc.x} ${inc.y - 5} L ${inc.x + 5} ${inc.y + 4} Z`}
                    fill="none"
                    stroke="var(--status-warning)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                )}
                {inc.kind === 'closure' && (
                  <path
                    d={`M ${inc.x - 5} ${inc.y} L ${inc.x + 5} ${inc.y}`}
                    stroke="var(--status-critical)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                )}
                <title>{`${inc.label} — ${inc.detail}`}</title>
              </g>
            ))}

            {/* restriction markers */}
            {restrictionMarkers.map((m) => (
              <g key={m.id}>
                <rect
                  x={m.x - 9}
                  y={m.y - 9}
                  width={18}
                  height={18}
                  rx={3}
                  fill="#050505"
                  stroke="var(--status-warning)"
                  strokeWidth={1.5}
                />
                <text
                  x={m.x}
                  y={m.y + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="var(--status-warning)"
                  style={{ pointerEvents: 'none' }}
                >
                  {m.kind === 'height' ? 'H' : m.kind === 'weight' ? 'W' : m.kind === 'vehicle' ? 'V' : 'R'}
                </text>
                <title>{`${m.label} — ${m.detail}`}</title>
              </g>
            ))}
          </g>

          {/* watermark — outside the pan/zoom group so it stays pinned */}
          <text
            x={VIEWBOX.width - 16}
            y={VIEWBOX.height - 16}
            textAnchor="end"
            fontSize={13}
            fontWeight={600}
            letterSpacing={1}
            fill="#6a6a6a"
            style={{ pointerEvents: 'none' }}
          >
            SIMULATED / DEMONSTRATION NETWORK
          </text>
        </svg>

        {/* map controls */}
        <div className={cn('absolute flex flex-col gap-1.5', fill ? 'left-3 top-1/2 -translate-y-1/2' : 'right-3 top-3')}>
          <MapControl label="Zoom in" onClick={() => zoomButton(1.2)}>
            <Plus aria-hidden="true" className="size-4" />
          </MapControl>
          <MapControl label="Zoom out" onClick={() => zoomButton(1 / 1.2)}>
            <Minus aria-hidden="true" className="size-4" />
          </MapControl>
          <MapControl label="Reset view" onClick={reset}>
            <RotateCcw aria-hidden="true" className="size-4" />
          </MapControl>
        </div>

        {/* interaction hint */}
        {showHint && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border/70 bg-surface-sunken/80 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
            <Maximize2 aria-hidden="true" className="size-3" />
            Drag to pan · scroll to zoom
          </div>
        )}

        {/* focused route summary */}
        {showFocusCard && focused && (
          <div className="absolute bottom-3 left-3 max-w-xs rounded-md border border-border bg-surface-raised/95 p-3 text-xs backdrop-blur">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: vehicleColorVar[focused.vehicle] }}
                aria-hidden="true"
              />
              <span className="font-semibold text-foreground">{focused.label} route</span>
              <span className="ml-auto tabular-nums text-muted-foreground">
                {focused.distanceKm} km · {focused.etaMin} min
              </span>
            </div>
            <p className="mt-1.5 text-muted-foreground">{focused.summary}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {focused.respects.map((line) => (
                <li key={line} className="flex items-start gap-1.5 text-muted-foreground">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-status-warning" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showLegend && <MapLegend />}
    </div>
  )
}

function MapControl({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md border border-border bg-surface-raised text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  )
}

function MapLegend() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-border bg-card/40 p-3 text-xs sm:grid-cols-3 lg:grid-cols-4">
      <LegendGroup title="Road hierarchy">
        <LegendLine width={4} color="#3d3d3d" label="Major road" />
        <LegendLine width={2.5} color="#323232" label="Secondary" />
        <LegendLine width={1.5} color="#262626" label="Tertiary" />
      </LegendGroup>
      <LegendGroup title="Traffic">
        <LegendLine width={2.5} color="var(--status-critical)" dashed label="Heavy congestion" />
        <LegendLine width={2} color="var(--status-warning)" dashed label="Moderate" />
        <LegendLine width={2} color="#5a5a5a" label="Flyover" />
      </LegendGroup>
      <LegendGroup title="Restrictions & incidents">
        <LegendSwatch label="H height · W weight" tone="var(--status-warning)" square />
        <LegendSwatch label="V vehicle · R restricted" tone="var(--status-warning)" square />
        <LegendSwatch label="Incident" tone="var(--status-critical)" />
      </LegendGroup>
      <LegendGroup title="Vehicle routes">
        <LegendLine width={3} color="var(--traffic-emergency)" label="Emergency" />
        <LegendLine width={3} color="var(--traffic-freight)" label="Freight" />
        <LegendLine width={3} color="var(--traffic-passenger)" label="Passenger" />
        <LegendLine width={3} color="var(--traffic-two-wheeler)" label="Two-wheeler" />
      </LegendGroup>
    </div>
  )
}

function LegendGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

function LegendLine({
  width,
  color,
  label,
  dashed,
}: {
  width: number
  color: string
  label: string
  dashed?: boolean
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <svg width={22} height={8} aria-hidden="true" className="shrink-0">
        <line
          x1={1}
          y1={4}
          x2={21}
          y2={4}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? '3 3' : undefined}
        />
      </svg>
      {label}
    </div>
  )
}

function LegendSwatch({ label, tone, square }: { label: string; tone: string; square?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span
        className={cn('size-3 shrink-0 border', square ? 'rounded-[3px]' : 'rounded-full')}
        style={{ borderColor: tone, backgroundColor: '#050505' }}
        aria-hidden="true"
      />
      {label}
    </div>
  )
}
