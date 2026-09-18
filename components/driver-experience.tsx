'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Ambulance,
  ArrowRight,
  Ban,
  Bike,
  Car,
  ChevronDown,
  ChevronUp,
  CircleSlash,
  MapPin,
  Navigation,
  Route,
  Ruler,
  ShieldCheck,
  Square,
  TrafficCone,
  TriangleAlert,
  Truck,
  Weight,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TrafficMap } from '@/components/traffic-map'
import {
  vehicleColorVar,
  vehicleRouteByClass,
  type VehicleClass,
} from '@/lib/traffic-network'
import {
  computeTrip,
  driverDestinations,
  driverOrigin,
  type ReasonKind,
} from '@/lib/driver-trip'
import { appName } from '@/types/traffic'
import { useTrafficApp } from '@/components/traffic-app-provider'

const vehicleMeta: Record<VehicleClass, { label: string; Icon: LucideIcon }> = {
  freight: { label: 'Freight', Icon: Truck },
  passenger: { label: 'Passenger', Icon: Car },
  'two-wheeler': { label: 'Two-wheeler', Icon: Bike },
  emergency: { label: 'Emergency', Icon: Ambulance },
}

const vehicleOrder: VehicleClass[] = ['freight', 'passenger', 'two-wheeler', 'emergency']

const reasonIcon: Record<ReasonKind, LucideIcon> = {
  height: Ruler,
  weight: Weight,
  congestion: TrafficCone,
  vehicle: Ban,
  restricted: CircleSlash,
}

export function DriverExperience() {
  const { emergencyState, selectedDestination, setSelectedDestination, currentCustomRoutes, startEmergency, resetEmergency } = useTrafficApp()
  const [vehicle, setVehicle] = useState<VehicleClass>('freight')
  const [navigating, setNavigating] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)

  const trip = useMemo(() => computeTrip(vehicle, selectedDestination, emergencyState), [vehicle, selectedDestination, emergencyState])
  const route = useMemo(() => currentCustomRoutes.find(r => r.vehicle === vehicle)!, [currentCustomRoutes, vehicle])
  const activeMeta = vehicleMeta[vehicle]

  const selectVehicle = (next: VehicleClass) => {
    setVehicle(next)
    setNavigating(false)
    setAnalysisOpen(false)
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <TrafficMap
        fill
        selectable={false}
        showLegend={false}
        showFocusCard={false}
        showHint={false}
        selection={vehicle}
        customRoutes={currentCustomRoutes}
        className="absolute inset-0"
      />

      {/* Top: trip context + compact vehicle selector */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 flex flex-col gap-2">
        {showPrivacyBanner && (
          <div className="pointer-events-auto mx-auto w-full max-w-md flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-raised/90 px-3 py-2 text-[11px] text-muted-foreground shadow-lg backdrop-blur">
            <span className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-emerald-500/80" />
              <span>Location shared only during active trips, used for routing and anonymized analytics.</span>
            </span>
            <button 
              onClick={() => setShowPrivacyBanner(false)}
              className="p-1 -mr-1 rounded hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              aria-label="Dismiss privacy notice"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        {emergencyState !== 'NORMAL' && (
          <div className="pointer-events-auto mx-auto w-full max-w-md flex items-center gap-2 rounded-xl border border-[var(--traffic-emergency)]/30 bg-[#151010]/95 px-3 py-2 text-xs font-medium text-[var(--traffic-emergency)] shadow-lg backdrop-blur">
            <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
            <span className="flex-1 truncate">Ambulance Priority Route Active</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--traffic-emergency)] font-medium border border-[var(--traffic-emergency)]/20 bg-[var(--traffic-emergency)]/10 px-1.5 py-0.5 rounded-sm inline-flex items-center w-max ml-auto shrink-0">
              Simulated
            </span>
          </div>
        )}
        <div className="pointer-events-auto mx-auto w-full max-w-md flex flex-col gap-2.5 rounded-xl border border-border bg-surface-raised/90 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md">
              <Image src="/logo.png" alt="MargDarshak Logo" width={24} height={24} className="h-full w-full object-cover" />
            </span>
            <span className="text-xs font-semibold tracking-tight">{appName}</span>
            <span className="text-xs text-muted-foreground">Driver</span>
            <button
              onClick={emergencyState === 'NORMAL' ? startEmergency : resetEmergency}
              className="ml-auto rounded-md px-2 py-0.5 text-[10px] font-medium text-[var(--traffic-emergency)] border border-[var(--traffic-emergency)]/30 hover:bg-[var(--traffic-emergency)]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {emergencyState === 'NORMAL' ? 'Simulate Emergency' : 'Reset Emergency'}
            </button>
            <Link
              href="/operations"
              className="flex items-center gap-1.5 rounded-md bg-white pl-4 pr-3 py-1 text-[10px] font-semibold text-black hover:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-2"
            >
              Operations <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-muted-foreground">{driverOrigin}</span>
            <span aria-hidden="true" className="text-muted-foreground">→</span>
            <label className="relative ml-auto flex items-center">
              <span className="sr-only">Destination</span>
              <select
                value={selectedDestination}
                onChange={(e) => {
                  setSelectedDestination(e.target.value)
                  setNavigating(false)
                }}
                className="appearance-none rounded-md border border-border bg-surface-sunken py-1 pl-2 pr-7 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {driverDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground"
              />
            </label>
          </div>

          <div className="flex items-center gap-1" role="group" aria-label="Vehicle class">
            {vehicleOrder.map((v) => {
              const meta = vehicleMeta[v]
              const active = vehicle === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => selectVehicle(v)}
                  aria-pressed={active}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'border-border bg-secondary text-foreground'
                      : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <meta.Icon
                    aria-hidden="true"
                    className="size-4"
                    style={active ? { color: vehicleColorVar[v] } : undefined}
                  />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Bottom sheet: route summary, analysis, navigation */}
      <section className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3">
        <div className="pointer-events-auto mx-auto flex max-h-[72vh] max-w-md flex-col overflow-y-auto rounded-xl border border-border bg-surface-raised/95 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={() => setAnalysisOpen((o) => !o)}
            aria-expanded={analysisOpen}
            aria-label={analysisOpen ? 'Collapse route analysis' : 'Expand route analysis'}
            className="flex w-full items-center justify-center py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true" className="h-1 w-10 rounded-full bg-border" />
          </button>

          <div className="flex flex-col gap-3 px-4 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: vehicleColorVar[vehicle] }}
                    aria-hidden="true"
                  />
                  Feasible route · {activeMeta.label}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums">{trip.feasibleMin} min</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{trip.feasibleKm} km</span>
                </span>
                <span className="truncate text-xs text-muted-foreground">to {trip.destinationName}</span>
              </div>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-border bg-surface-sunken px-2 py-1 text-xs text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-3.5 text-status-success" />
                {route.respects.length} honored
              </span>
            </div>

            {navigating && (
              <div className="flex items-center gap-2 rounded-lg border border-status-info/30 bg-status-info/10 px-3 py-2 text-xs text-status-info">
                <Navigation aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="text-foreground shrink-0">Navigating</span>
                <span className="text-muted-foreground truncate">— continue on {trip.via.split('&')[0].trim()}</span>
              </div>
            )}

            {trip.shortestInfeasible ? (
              <button
                type="button"
                onClick={() => setAnalysisOpen((o) => !o)}
                aria-expanded={analysisOpen}
                className="flex items-center gap-2 rounded-lg border border-status-warning/40 bg-status-warning/5 px-3 py-2 text-left text-xs transition-colors hover:bg-status-warning/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TriangleAlert aria-hidden="true" className="size-4 shrink-0 text-status-warning" />
                <span className="flex-1">
                  <span className="font-medium text-foreground">Shortest ≠ Feasible.</span>{' '}
                  <span className="text-muted-foreground">
                    Direct {trip.shortestKm} km path blocked by {trip.reasons.length} restriction
                    {trip.reasons.length === 1 ? '' : 's'}.
                  </span>
                </span>
                {analysisOpen ? (
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronUp aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-status-success/40 bg-status-success/5 px-3 py-2 text-xs">
                <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-status-success" />
                <span className="text-muted-foreground">
                  The shortest {trip.shortestKm} km path is already feasible for this class.
                </span>
              </div>
            )}

            {analysisOpen && trip.shortestInfeasible && (
              <div className="flex flex-col gap-3 border-t border-border pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5 rounded-lg border border-status-critical/40 bg-status-critical/5 p-2.5">
                    <span className="flex items-center gap-1.5 text-xs text-status-critical">
                      <Ban aria-hidden="true" className="size-3.5" />
                      Shortest
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-foreground line-through decoration-status-critical/60">
                      {trip.shortestKm} km
                    </span>
                    <span className="text-xs text-muted-foreground">via {trip.shortestVia}</span>
                    <span className="text-xs font-medium text-status-critical">Not usable</span>
                  </div>
                  <div className="flex flex-col gap-0.5 rounded-lg border border-status-success/40 bg-status-success/5 p-2.5">
                    <span className="flex items-center gap-1.5 text-xs text-status-success">
                      <ShieldCheck aria-hidden="true" className="size-3.5" />
                      Feasible
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-foreground">{trip.feasibleKm} km</span>
                    <span className="text-xs text-muted-foreground">via {trip.via}</span>
                    <span className="text-xs font-medium text-status-success">Recommended</span>
                    <span className={trip.detourPercent > 20 ? "text-[10px] font-medium text-status-warning" : "text-[10px] font-medium text-status-success"}>
                      Detour: +{trip.detourPercent}% ({trip.detourPercent > 20 ? 'exceeds fairness bound — route adjusted' : 'within 20% fairness bound'})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  The direct path is {trip.detourKm} km shorter but cannot be used by a {activeMeta.label.toLowerCase()}{' '}
                  vehicle:
                </p>

                <ul className="flex flex-col gap-2">
                  {trip.reasons.map((reason) => {
                    const Icon = reasonIcon[reason.kind]
                    return (
                      <li
                        key={reason.title}
                        className="flex gap-2.5 rounded-md border border-border bg-surface-sunken p-2.5"
                      >
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-status-warning/10 text-status-warning">
                          <Icon aria-hidden="true" className="size-3.5" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-foreground">{reason.title}</span>
                          <span className="text-xs leading-5 text-muted-foreground">{reason.detail}</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <div className="flex flex-col gap-1.5 rounded-md border border-border bg-surface-sunken p-2.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                    Restrictions honored on your route
                  </span>
                  <ul className="flex flex-col gap-1">
                    {route.respects.map((line) => (
                      <li key={line} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-status-success" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {navigating ? (
              <button
                type="button"
                onClick={() => setNavigating(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-status-critical/40 bg-status-critical/15 text-sm font-medium text-status-critical transition-colors hover:bg-status-critical/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Square aria-hidden="true" className="size-4" />
                Stop navigation
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setNavigating(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Navigation aria-hidden="true" className="size-4" />
                Start navigation
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
