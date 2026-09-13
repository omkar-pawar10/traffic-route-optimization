'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import {
  type AppRole,
  type RoutePreferences,
  type TrafficClientState,
  createDefaultRoutePreferences,
} from '@/types/traffic'

const TrafficAppContext = createContext<TrafficClientState | null>(null)

export function TrafficAppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null)
  const [preferences, setPreferencesState] = useState<RoutePreferences>(
    createDefaultRoutePreferences,
  )

  const value = useMemo<TrafficClientState>(
    () => ({
      role,
      preferences,
      setRole,
      setPreferences: (next) => setPreferencesState((current) => ({ ...current, ...next })),
      reset: () => {
        setRole(null)
        setPreferencesState(createDefaultRoutePreferences())
      },
    }),
    [preferences, role],
  )

  return <TrafficAppContext.Provider value={value}>{children}</TrafficAppContext.Provider>
}

export function useTrafficApp() {
  const context = useContext(TrafficAppContext)
  if (!context) throw new Error('useTrafficApp must be used within TrafficAppProvider')
  return context
}
