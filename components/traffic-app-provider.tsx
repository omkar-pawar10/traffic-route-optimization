'use client'

import { createContext, useContext, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import {
  type AppRole,
  type RoutePreferences,
  type TrafficClientState,
  type EmergencyState,
  createDefaultRoutePreferences,
} from '@/types/traffic'
import { routesForDestination, emergencyAlternateRoutes } from '@/lib/traffic-network'

const TrafficAppContext = createContext<TrafficClientState | null>(null)

export function TrafficAppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null)
  const [preferences, setPreferencesState] = useState<RoutePreferences>(
    createDefaultRoutePreferences,
  )
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('NORMAL')
  const [selectedDestination, setSelectedDestination] = useState<string>('electroniccity')
  const emergencyTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentCustomRoutes = useMemo(() => {
    let routesRecord = routesForDestination[selectedDestination] ?? routesForDestination['electroniccity']
    
    // Use the physically authored alternate routes to clear the emergency corridor
    if ((emergencyState === 'ROUTE UPDATED' || emergencyState === 'ALTERNATE CORRIDOR') && emergencyAlternateRoutes[selectedDestination]) {
      routesRecord = emergencyAlternateRoutes[selectedDestination]
    }
    
    return Object.values(routesRecord)
  }, [selectedDestination, emergencyState])

  useEffect(() => {
    return () => {
      if (emergencyTimerRef.current) {
        clearTimeout(emergencyTimerRef.current)
      }
    }
  }, [])

  const resetEmergency = useCallback(() => {
    if (emergencyTimerRef.current) {
      clearTimeout(emergencyTimerRef.current)
      emergencyTimerRef.current = null
    }
    setEmergencyState('NORMAL')
  }, [])

  const startEmergency = useCallback(() => {
    if (emergencyState !== 'NORMAL' || emergencyTimerRef.current) return

    setEmergencyState('APPROACHING')

    emergencyTimerRef.current = setTimeout(() => {
      setEmergencyState('ALTERNATE CORRIDOR')

      emergencyTimerRef.current = setTimeout(() => {
        setEmergencyState('ROUTE UPDATED')
        emergencyTimerRef.current = null
      }, 2500)
    }, 2500)
  }, [emergencyState])

  const value = useMemo<TrafficClientState>(
    () => ({
      role,
      preferences,
      emergencyState,
      selectedDestination,
      currentCustomRoutes,
      setRole,
      setPreferences: (next) => setPreferencesState((current) => ({ ...current, ...next })),
      setSelectedDestination,
      startEmergency,
      resetEmergency,
      reset: () => {
        setRole(null)
        setPreferencesState(createDefaultRoutePreferences())
        setSelectedDestination('electroniccity')
        resetEmergency()
      },
    }),
    [preferences, role, emergencyState, selectedDestination, currentCustomRoutes, startEmergency, resetEmergency],
  )

  return <TrafficAppContext.Provider value={value}>{children}</TrafficAppContext.Provider>
}

export function useTrafficApp() {
  const context = useContext(TrafficAppContext)
  if (!context) throw new Error('useTrafficApp must be used within TrafficAppProvider')
  return context
}
