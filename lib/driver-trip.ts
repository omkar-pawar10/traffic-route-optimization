// Deterministic per-vehicle trip analysis for the driver experience.
// These numbers are hand-authored for the SIMULATED / DEMONSTRATION network
// and are intentionally decoupled from the map-scale route distances in
// traffic-network.ts — they represent a single local trip so the driver
// screen can teach the core idea: the shortest path is not always feasible.

import type { VehicleClass } from './traffic-network'

export type ReasonKind = 'height' | 'weight' | 'congestion' | 'vehicle' | 'restricted'

export interface InfeasibilityReason {
  kind: ReasonKind
  title: string
  detail: string
}

interface TripBase {
  shortestKm: number
  shortestMin: number
  feasibleKm: number
  feasibleMin: number
  /** the direct path that gets rejected (or matched) */
  shortestVia: string
  /** the recommended, feasible path */
  via: string
  reasons: InfeasibilityReason[]
}

export interface DriverTrip extends TripBase {
  destinationName: string
  detourKm: number
  /** true when the shortest path cannot be used and a detour is required */
  shortestInfeasible: boolean
}

export const driverOrigin = 'Yeshwanthpur Depot'

export const driverDestinations = [
  { id: 'electroniccity', name: 'Electronic City' },
  { id: 'whitefield', name: 'Whitefield' },
  { id: 'silkboard', name: 'Silk Board Junction' },
  { id: 'koramangala', name: 'Koramangala' },
] as const

export type DriverDestinationId = (typeof driverDestinations)[number]['id']

// Freight is the default demonstration scenario and uses the exact required
// figures: 7.4 km / 18 min feasible vs a 6.8 km shortest path that is blocked.
const tripBaseByVehicle: Record<VehicleClass, TripBase> = {
  freight: {
    shortestKm: 6.8,
    shortestMin: 15,
    feasibleKm: 7.4,
    feasibleMin: 18,
    shortestVia: 'MG Road & Hebbal Flyover',
    via: 'Outer Ring Road & Hosur Road',
    reasons: [
      {
        kind: 'height',
        title: 'Height limit — 4.2 m',
        detail:
          'The direct path crosses Hebbal Flyover, which has a 4.2 m clearance. An over-height freight vehicle physically cannot pass under it.',
      },
      {
        kind: 'weight',
        title: 'Weight limit — 10 t',
        detail:
          'It also relies on the Vrishabhavathi Bridge, restricted to a 10 t axle load — below this loaded truck.',
      },
      {
        kind: 'congestion',
        title: 'Heavy congestion & freight ban',
        detail:
          'MG Road on the direct path is heavily congested and prohibits freight vehicles between 7am and 11pm.',
      },
    ],
  },
  passenger: {
    shortestKm: 6.8,
    shortestMin: 16,
    feasibleKm: 7.0,
    feasibleMin: 17,
    shortestVia: 'Cubbon restricted stretch',
    via: 'Inner Ring Road & Koramangala',
    reasons: [
      {
        kind: 'restricted',
        title: 'Restricted zone',
        detail: 'The shortest path enters the Cubbon restricted stretch, which is closed to through traffic.',
      },
      {
        kind: 'congestion',
        title: 'Congestion on the direct link',
        detail: 'The next-shortest alternative runs through a heavily congested corridor and loses the time saved.',
      },
    ],
  },
  'two-wheeler': {
    shortestKm: 6.8,
    shortestMin: 15,
    feasibleKm: 6.8,
    feasibleMin: 15,
    shortestVia: 'Vrishabhavathi Bridge & Jayanagar',
    via: 'Vrishabhavathi Bridge & Jayanagar',
    reasons: [],
  },
  emergency: {
    shortestKm: 6.8,
    shortestMin: 12,
    feasibleKm: 6.9,
    feasibleMin: 12,
    shortestVia: 'Cubbon restricted stretch',
    via: 'Priority corridor via MG Road',
    reasons: [
      {
        kind: 'restricted',
        title: 'Restricted zone respected',
        detail: 'Even under priority dispatch, the route avoids the Cubbon restricted stretch on the direct path.',
      },
    ],
  },
}

// Distance scale per destination keeps every derived trip deterministic.
const scaleByDestination: Record<string, number> = {
  electroniccity: 1,
  whitefield: 1.24,
  silkboard: 0.69,
  koramangala: 0.58,
}

const round1 = (n: number) => Math.round(n * 10) / 10

export function computeTrip(vehicle: VehicleClass, destinationId: string): DriverTrip {
  const base = tripBaseByVehicle[vehicle]
  const scale = scaleByDestination[destinationId] ?? 1
  const destination = driverDestinations.find((d) => d.id === destinationId)
  const shortestKm = round1(base.shortestKm * scale)
  const feasibleKm = round1(base.feasibleKm * scale)

  return {
    ...base,
    shortestKm,
    feasibleKm,
    shortestMin: Math.max(1, Math.round(base.shortestMin * scale)),
    feasibleMin: Math.max(1, Math.round(base.feasibleMin * scale)),
    destinationName: destination?.name ?? 'Destination',
    detourKm: round1(feasibleKm - shortestKm),
    shortestInfeasible: base.reasons.length > 0,
  }
}
