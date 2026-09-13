// Deterministic, fictional Indian urban road network for the demonstration map.
// No map API and no coordinates from any live service — every point below is
// authored by hand so the same network and the same routes always render
// identically. This is a SIMULATED / DEMONSTRATION network only.

export type Point = [number, number]

export type RoadClass = 'major' | 'secondary' | 'tertiary'
export type Congestion = 'free' | 'moderate' | 'heavy'

export type VehicleClass = 'emergency' | 'freight' | 'passenger' | 'two-wheeler'

export const VIEWBOX = { width: 1200, height: 820 } as const

export interface Junction {
  id: string
  name: string
  x: number
  y: number
  kind: 'junction' | 'flyover' | 'place' | 'depot' | 'destination'
  /** preferred label placement relative to the dot */
  anchor?: 'start' | 'middle' | 'end'
  labelDy?: number
}

export interface RestrictionInfo {
  height?: string
  weight?: string
  /** vehicle classes physically prohibited from this segment */
  bannedVehicles?: VehicleClass[]
  note?: string
}

export interface RoadSegment {
  id: string
  name: string
  roadClass: RoadClass
  points: Point[]
  congestion?: Congestion
  flyover?: boolean
  /** regulatory / physical no-through segment */
  restricted?: boolean
  restriction?: RestrictionInfo
}

export type IncidentKind = 'accident' | 'roadwork' | 'closure'

export interface Incident {
  id: string
  x: number
  y: number
  kind: IncidentKind
  label: string
  detail: string
}

export type RestrictionMarkerKind = 'height' | 'weight' | 'vehicle' | 'restricted'

export interface RestrictionMarker {
  id: string
  x: number
  y: number
  kind: RestrictionMarkerKind
  label: string
  detail: string
}

export interface VehicleRoute {
  vehicle: VehicleClass
  label: string
  points: Point[]
  distanceKm: number
  etaMin: number
  summary: string
  /** physical restrictions this class had to route around */
  respects: string[]
}

// ---------------------------------------------------------------------------
// Junctions & places
// ---------------------------------------------------------------------------

export const junctions: Junction[] = [
  { id: 'yeshwanthpur', name: 'Yeshwanthpur Depot', x: 250, y: 250, kind: 'depot', anchor: 'start', labelDy: -14 },
  { id: 'yelahanka', name: 'Yelahanka', x: 500, y: 120, kind: 'place', anchor: 'middle', labelDy: -14 },
  { id: 'airport', name: 'Airport Road Gate', x: 700, y: 44, kind: 'place', anchor: 'start', labelDy: -12 },
  { id: 'hebbal', name: 'Hebbal Flyover', x: 620, y: 110, kind: 'flyover', anchor: 'start', labelDy: -14 },
  { id: 'krpuram', name: 'KR Puram Junction', x: 960, y: 300, kind: 'junction', anchor: 'end', labelDy: -14 },
  { id: 'whitefield', name: 'Whitefield', x: 1090, y: 260, kind: 'place', anchor: 'end', labelDy: -14 },
  { id: 'marathahalli', name: 'Marathahalli', x: 900, y: 430, kind: 'junction', anchor: 'start', labelDy: 22 },
  { id: 'mgcenter', name: 'MG Road', x: 620, y: 400, kind: 'junction', anchor: 'middle', labelDy: -14 },
  { id: 'majestic', name: 'Majestic', x: 470, y: 430, kind: 'junction', anchor: 'end', labelDy: -14 },
  { id: 'jayanagar', name: 'Jayanagar', x: 470, y: 600, kind: 'place', anchor: 'end', labelDy: 22 },
  { id: 'koramangala', name: 'Koramangala', x: 660, y: 540, kind: 'junction', anchor: 'start', labelDy: -14 },
  { id: 'silkboard', name: 'Silk Board Junction', x: 640, y: 660, kind: 'junction', anchor: 'end', labelDy: -14 },
  { id: 'electroniccity', name: 'Electronic City', x: 700, y: 780, kind: 'destination', anchor: 'start', labelDy: 24 },
]

export const junctionById = Object.fromEntries(junctions.map((j) => [j.id, j])) as Record<string, Junction>

// ---------------------------------------------------------------------------
// Road segments (hierarchy, congestion, flyovers, restrictions)
// ---------------------------------------------------------------------------

export const roads: RoadSegment[] = [
  {
    id: 'orr',
    name: 'Outer Ring Road',
    roadClass: 'major',
    points: [
      [620, 110], [800, 170], [960, 300], [940, 380], [900, 430],
      [820, 560], [640, 660], [540, 640], [470, 600], [440, 520],
      [470, 430], [360, 340], [250, 250], [380, 150], [500, 120], [620, 110],
    ],
    congestion: 'moderate',
  },
  {
    id: 'inner-ring',
    name: 'Inner Ring Road',
    roadClass: 'secondary',
    points: [
      [620, 200], [760, 280], [780, 400], [700, 500], [560, 520],
      [470, 460], [500, 340], [560, 250], [620, 200],
    ],
    congestion: 'moderate',
  },
  {
    id: 'mg-road',
    name: 'MG Road',
    roadClass: 'major',
    points: [[470, 430], [560, 410], [620, 400], [720, 400], [820, 420], [900, 430]],
    congestion: 'heavy',
    restriction: { bannedVehicles: ['freight'], note: 'No freight vehicles 7am–11pm' },
  },
  {
    id: 'airport-road',
    name: 'Airport Road',
    roadClass: 'major',
    points: [[620, 110], [660, 80], [700, 44]],
    congestion: 'free',
  },
  {
    id: 'hebbal-flyover',
    name: 'Hebbal Flyover',
    roadClass: 'major',
    points: [[540, 150], [620, 110], [700, 90]],
    flyover: true,
    restriction: { height: '4.2 m', bannedVehicles: ['freight'], note: 'Over-height freight prohibited' },
  },
  {
    id: 'hosur-road',
    name: 'Hosur Road',
    roadClass: 'major',
    points: [[640, 660], [670, 720], [700, 780]],
    congestion: 'moderate',
  },
  {
    id: 'whitefield-road',
    name: 'Whitefield Road',
    roadClass: 'secondary',
    points: [[960, 300], [1030, 280], [1090, 260]],
    congestion: 'free',
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    roadClass: 'secondary',
    points: [[660, 540], [760, 490], [900, 430]],
    congestion: 'heavy',
  },
  {
    id: 'magadi-road',
    name: 'Magadi Road',
    roadClass: 'tertiary',
    points: [[250, 250], [330, 320], [400, 380], [470, 430]],
    congestion: 'moderate',
  },
  {
    id: 'vrishabhavathi-bridge',
    name: 'Vrishabhavathi Bridge',
    roadClass: 'secondary',
    points: [[470, 460], [470, 520], [470, 600]],
    restriction: { weight: '10 t', bannedVehicles: ['freight'], note: 'Weak bridge — 10 t axle limit' },
  },
  {
    id: 'jayanagar-link',
    name: 'Jayanagar Link',
    roadClass: 'tertiary',
    points: [[470, 600], [560, 570], [660, 540]],
    congestion: 'moderate',
  },
  {
    id: 'koramangala-link',
    name: 'Koramangala Link',
    roadClass: 'tertiary',
    points: [[660, 540], [650, 600], [640, 660]],
    congestion: 'moderate',
  },
  {
    id: 'cubbon-restricted',
    name: 'Cubbon Restricted Stretch',
    roadClass: 'tertiary',
    points: [[560, 410], [540, 470], [560, 520]],
    restricted: true,
    restriction: { note: 'No through traffic — restricted zone' },
  },
  {
    id: 'bannerghatta-road',
    name: 'Bannerghatta Road',
    roadClass: 'secondary',
    points: [[620, 400], [640, 470], [660, 540]],
    congestion: 'moderate',
  },
]

// ---------------------------------------------------------------------------
// Incidents & restriction markers
// ---------------------------------------------------------------------------

export const incidents: Incident[] = [
  { id: 'inc-1', x: 720, y: 400, kind: 'accident', label: 'Collision — MG Road', detail: 'Two lanes blocked, tow en route' },
  { id: 'inc-2', x: 820, y: 470, kind: 'roadwork', label: 'Roadwork — Sarjapur Road', detail: 'Utility trenching, single lane' },
  { id: 'inc-3', x: 550, y: 470, kind: 'closure', label: 'Closure — Cubbon Stretch', detail: 'Restricted zone, no entry' },
]

export const restrictionMarkers: RestrictionMarker[] = [
  { id: 'res-h1', x: 620, y: 110, kind: 'height', label: 'Height limit 4.2 m', detail: 'Hebbal Flyover — over-height freight prohibited' },
  { id: 'res-w1', x: 470, y: 520, kind: 'weight', label: 'Weight limit 10 t', detail: 'Vrishabhavathi Bridge — axle load restricted' },
  { id: 'res-v1', x: 560, y: 405, kind: 'vehicle', label: 'No freight', detail: 'MG Road — freight vehicles prohibited daytime' },
  { id: 'res-r1', x: 545, y: 470, kind: 'restricted', label: 'Restricted zone', detail: 'Cubbon Stretch — no through traffic' },
]

// ---------------------------------------------------------------------------
// Vehicle-class routes — shared origin (Yeshwanthpur Depot) and destination
// (Electronic City). Each class takes a different feasible path. Physical
// restrictions are always respected: freight avoids the 4.2 m flyover, the
// 10 t bridge and the no-freight MG Road; the restricted Cubbon stretch is
// never used by any class. Emergency is fastest but does NOT bypass any
// physical height/weight/vehicle restriction.
// ---------------------------------------------------------------------------

export const vehicleRoutes: VehicleRoute[] = [
  {
    vehicle: 'emergency',
    label: 'Emergency',
    points: [
      [250, 250], [330, 320], [400, 380], [470, 430], [560, 410],
      [620, 400], [640, 470], [660, 540], [650, 600], [640, 660],
      [670, 720], [700, 780],
    ],
    distanceKm: 21.4,
    etaMin: 24,
    summary: 'Priority corridor via MG Road and Bannerghatta Road',
    respects: ['Avoids the restricted Cubbon stretch even under priority'],
  },
  {
    vehicle: 'passenger',
    label: 'Passenger',
    points: [
      [250, 250], [360, 340], [470, 430], [500, 460], [560, 520],
      [660, 540], [650, 600], [640, 660], [670, 720], [700, 780],
    ],
    distanceKm: 23.9,
    etaMin: 33,
    summary: 'Ring Road to Inner Ring, then Koramangala to Hosur Road',
    respects: ['Stays on car-permitted corridors'],
  },
  {
    vehicle: 'freight',
    label: 'Freight',
    points: [
      [250, 250], [380, 150], [500, 120], [620, 110], [800, 170],
      [960, 300], [940, 380], [900, 430], [820, 560], [640, 660],
      [670, 720], [700, 780],
    ],
    distanceKm: 38.6,
    etaMin: 52,
    summary: 'Outer Ring Road the long way around the core',
    respects: [
      'Detours around the 4.2 m Hebbal Flyover',
      'Avoids the 10 t Vrishabhavathi Bridge',
      'Excluded from MG Road (no-freight)',
    ],
  },
  {
    vehicle: 'two-wheeler',
    label: 'Two-wheeler',
    points: [
      [250, 250], [330, 320], [400, 380], [470, 430], [470, 520],
      [470, 600], [560, 570], [660, 540], [650, 600], [640, 660],
      [670, 720], [700, 780],
    ],
    distanceKm: 20.1,
    etaMin: 29,
    summary: 'Magadi Road and the Vrishabhavathi Bridge through Jayanagar',
    respects: ['Uses the 10 t bridge legally — well under the axle limit'],
  },
]

export const vehicleRouteByClass = Object.fromEntries(
  vehicleRoutes.map((r) => [r.vehicle, r]),
) as Record<VehicleClass, VehicleRoute>

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

export function toPathD(points: Point[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`)
    .join(' ')
}

export const vehicleColorVar: Record<VehicleClass, string> = {
  emergency: 'var(--traffic-emergency)',
  freight: 'var(--traffic-freight)',
  passenger: 'var(--traffic-passenger)',
  'two-wheeler': 'var(--traffic-two-wheeler)',
}

export const roadClassWidth: Record<RoadClass, number> = {
  major: 9,
  secondary: 5.5,
  tertiary: 3,
}

export const congestionColorVar: Record<Exclude<Congestion, 'free'>, string> = {
  moderate: 'var(--status-warning)',
  heavy: 'var(--status-critical)',
}
