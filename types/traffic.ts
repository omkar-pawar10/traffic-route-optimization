import type { VehicleRoute } from '@/lib/traffic-network'

export type AppRole = 'driver' | 'operations'
export type OptimizationMode = 'balanced' | 'fastest' | 'lowest-emissions'
export type TrafficView = 'map' | 'list' | 'chart'

export type EmergencyState = 'NORMAL' | 'APPROACHING' | 'ALTERNATE CORRIDOR' | 'ROUTE UPDATED'

export interface RoutePreferences {
  mode: OptimizationMode
  avoidTolls: boolean
  avoidHighways: boolean
}

export interface TrafficAppState {
  role: AppRole | null
  preferences: RoutePreferences
  emergencyState: EmergencyState
  selectedDestination: string
  currentCustomRoutes: VehicleRoute[]
}

export interface NavigationItem {
  label: string
  href: AppRoute
  description: string
}

export const appName = 'Quantum Route'
export const projectName = 'Quantum-Inspired Intelligent Traffic Route Optimization'
export const problemStatementId = 'SIH26137'
export const prototypeDisclaimer = 'Frontend-only demonstration prototype'

export const appRoutes = {
  driver: '/driver',
  operations: '/operations',
} as const

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes]

export const defaultRoutePreferences: RoutePreferences = {
  mode: 'balanced',
  avoidTolls: false,
  avoidHighways: false,
}

export const defaultTrafficAppState: TrafficAppState = {
  role: null,
  preferences: defaultRoutePreferences,
  emergencyState: 'NORMAL',
  selectedDestination: 'electroniccity',
  currentCustomRoutes: [], // Will be hydrated by provider
}

export const navigationItems: NavigationItem[] = [
  { label: 'Driver workspace', href: appRoutes.driver, description: 'Driver-facing route planning surface' },
  { label: 'Operations workspace', href: appRoutes.operations, description: 'Operations route monitoring surface' },
]

export interface TrafficClientState extends TrafficAppState {
  setRole: (role: AppRole | null) => void
  setPreferences: (preferences: Partial<RoutePreferences>) => void
  setSelectedDestination: (dest: string) => void
  startEmergency: () => void
  resetEmergency: () => void
  reset: () => void
}

export const createDefaultRoutePreferences = (): RoutePreferences => ({ ...defaultRoutePreferences })

export const getRouteTitle = (role: AppRole) => role === 'driver' ? 'Driver workspace' : 'Operations workspace'

export const getRouteDescription = (role: AppRole) => role === 'driver'
  ? 'The driver-facing route optimization surface will be built here.'
  : 'The operations route monitoring surface will be built here.'

export const getRoleFromPathname = (pathname: string): AppRole | null => {
  if (pathname.startsWith(appRoutes.driver)) return 'driver'
  if (pathname.startsWith(appRoutes.operations)) return 'operations'
  return null
}

export const isAppRole = (value: string): value is AppRole => value === 'driver' || value === 'operations'
export const isAppRoute = (value: string): value is AppRoute => value === appRoutes.driver || value === appRoutes.operations
export const getRoleLabel = (role: AppRole) => role === 'driver' ? 'Driver' : 'Operations'
