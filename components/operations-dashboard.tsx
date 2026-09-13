'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Map as MapIcon,
  Route,
  Server,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TrafficMap } from '@/components/traffic-map'
import { vehicleColorVar, type VehicleClass } from '@/lib/traffic-network'
import { useTrafficApp } from '@/components/traffic-app-provider'
import { OptimizationAnalysis } from '@/components/optimization-analysis'

type Selection = VehicleClass | 'all'
type ViewTab = 'LIVE OPERATIONS' | 'OPTIMIZATION ANALYSIS'

const mockRoutes = [
  { id: 'RT-2841', vehicle: 'freight', eta: '14m', distance: '12.4', congestion: 'High', status: 'Active' },
  { id: 'RT-1092', vehicle: 'passenger', eta: '8m', distance: '5.1', congestion: 'Low', status: 'Active' },
  { id: 'RT-9430', vehicle: 'two-wheeler', eta: '4m', distance: '2.8', congestion: 'Low', status: 'Active' },
  { id: 'RT-7721', vehicle: 'emergency', eta: '3m', distance: '4.2', congestion: 'Clear', status: 'Priority' },
  { id: 'RT-5509', vehicle: 'passenger', eta: '22m', distance: '18.9', congestion: 'Heavy', status: 'Delayed' },
  { id: 'RT-3312', vehicle: 'freight', eta: '45m', distance: '38.0', congestion: 'Medium', status: 'Active' },
]

export function OperationsDashboard() {
  const { emergencyState, startEmergency, resetEmergency } = useTrafficApp()
  const [activeTab, setActiveTab] = useState<ViewTab>('LIVE OPERATIONS')
  const [selection, setSelection] = useState<Selection>('all')
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  useEffect(() => {
    if (emergencyState !== 'NORMAL') {
      setSelection('emergency')
      setSelectedRouteId('RT-7721')
    } else {
      setSelection('all')
      setSelectedRouteId(null)
    }
  }, [emergencyState])

  const handleRouteSelect = (id: string, vehicle: VehicleClass) => {
    setSelectedRouteId(id)
    setSelection(vehicle)
  }

  const handleMapSelectionChange = (newSelection: Selection) => {
    setSelection(newSelection)
    if (newSelection === 'all') {
      setSelectedRouteId(null)
    } else {
      // If map is clicked, maybe clear selected route if it doesn't match the new selection,
      // or auto-select a route for that vehicle class if none is selected.
      const route = mockRoutes.find(r => r.id === selectedRouteId)
      if (route && route.vehicle !== newSelection) {
        setSelectedRouteId(null)
      }
    }
  }

  const selectedRoute = mockRoutes.find(r => r.id === selectedRouteId)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* View Toggle */}
      <div className="flex justify-center border-b border-[#292929] pb-4">
        <div className="flex gap-1 bg-[#101010] p-1 rounded-lg border border-[#292929]">
          <button
            onClick={() => setActiveTab('LIVE OPERATIONS')}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tracking-wider",
              activeTab === 'LIVE OPERATIONS'
                ? "bg-[#292929] text-[#F2F2F2] shadow-sm"
                : "text-[#A0A0A0] hover:text-[#F2F2F2] hover:bg-[#1B1B1B]"
            )}
          >
            LIVE OPERATIONS
          </button>
          <button
            onClick={() => setActiveTab('OPTIMIZATION ANALYSIS')}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring tracking-wider",
              activeTab === 'OPTIMIZATION ANALYSIS'
                ? "bg-[#292929] text-[#F2F2F2] shadow-sm"
                : "text-[#A0A0A0] hover:text-[#F2F2F2] hover:bg-[#1B1B1B]"
            )}
          >
            OPTIMIZATION ANALYSIS
          </button>
        </div>
      </div>

      {activeTab === 'OPTIMIZATION ANALYSIS' ? (
        <div className="flex-1 min-h-0">
          <OptimizationAnalysis />
        </div>
      ) : (
        <>
          {/* Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Vehicles" value="128" icon={Truck} />
        <MetricCard label="Routes" value="96" icon={Route} />
        <MetricCard label="Congestion" value="62%" icon={Activity} />
        <MetricCard label="Avg ETA" value="14.8 min" icon={Clock} />
        <MetricCard label="Latency" value="184 ms" icon={Server} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left Column: Route Table */}
        <div className="flex flex-col gap-3 rounded-lg border border-[#292929] bg-[#101010] overflow-hidden col-span-1">
          <div className="flex items-center justify-between border-b border-[#292929] px-4 py-3 bg-[#151515]">
            <h2 className="text-sm font-semibold text-[#F2F2F2] flex items-center gap-2">
              <MapIcon className="size-4 text-[#A0A0A0]" />
              Active Routes
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs text-[#A0A0A0]">
              <thead className="sticky top-0 bg-[#101010] text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 font-medium">Route ID</th>
                  <th className="px-4 py-2 font-medium">Class</th>
                  <th className="px-4 py-2 font-medium">ETA</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {mockRoutes.map((r) => {
                  const isSelected = selectedRouteId === r.id
                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleRouteSelect(r.id, r.vehicle as VehicleClass)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-[#1B1B1B]",
                        isSelected ? "bg-[#1B1B1B]" : ""
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-[#F2F2F2]">
                        {r.id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block size-2 rounded-full mr-2"
                          style={{ backgroundColor: vehicleColorVar[r.vehicle as VehicleClass] }}
                        />
                        <span className="capitalize">{r.vehicle}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{r.eta}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-sm text-[10px]",
                          r.status === 'Priority' ? "bg-red-500/10 text-red-400" :
                          r.status === 'Delayed' ? "bg-orange-500/10 text-orange-400" :
                          "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center/Right Column: Map & Inspector */}
        <div className="flex flex-col gap-4 col-span-1 lg:col-span-2">
          {/* Map area */}
          <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-[#292929] bg-[#101010]">
             <TrafficMap 
               fill 
               selection={selection}
               onSelectionChange={handleMapSelectionChange}
             />
          </div>

          {/* Bottom Panel: Engine Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 rounded-lg border border-[#292929] bg-[#101010] p-4">
              <h3 className="text-sm font-semibold text-[#F2F2F2] flex items-center gap-2">
                <Cpu className="size-4 text-[#A0A0A0]" />
                Engine Inspector
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <InspectorItem label="Selected Route" value={selectedRoute ? selectedRoute.id : '--'} />
                <InspectorItem label="Status" value={selectedRoute ? (emergencyState !== 'NORMAL' ? emergencyState : 'ACTIVE') : '--'} highlight={emergencyState === 'NORMAL'} />
                <InspectorItem label="Particles" value={selectedRoute ? "50" : '--'} />
                <InspectorItem label="Iterations" value={selectedRoute ? "31" : '--'} />
                <InspectorItem label="Algorithm" value={selectedRoute ? "A* READY" : '--'} />
                <InspectorItem label="SLA" value={selectedRoute ? (emergencyState === 'ROUTE UPDATED' ? '184ms' : '<500ms') : '--'} />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[#292929] bg-[#101010] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F2F2F2] flex items-center gap-2">
                  <AlertTriangle className="size-4 text-[#A0A0A0]" />
                  Alerts & Status
                </h3>
                {emergencyState === 'NORMAL' ? (
                  <button
                    onClick={startEmergency}
                    className="px-2 py-1 text-xs font-medium border border-[#292929] rounded bg-[#151515] hover:bg-[#1B1B1B] text-[#F2F2F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Simulate Emergency
                  </button>
                ) : (
                  <button
                    onClick={resetEmergency}
                    className="px-2 py-1 text-xs font-medium border border-[var(--traffic-emergency)] rounded bg-[var(--traffic-emergency)]/10 text-[var(--traffic-emergency)] hover:bg-[var(--traffic-emergency)]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Reset Simulation
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {emergencyState !== 'NORMAL' ? (
                  <div className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" style={{ color: 'var(--traffic-emergency)' }} />
                    <div>
                      <span className="block font-medium" style={{ color: 'var(--traffic-emergency)' }}>
                        AMBULANCE — {emergencyState === 'APPROACHING' ? 'Approaching' : emergencyState === 'ALTERNATE CORRIDOR' ? 'Rerouting' : 'SIMULATED'}
                      </span>
                      <span className="text-[#A0A0A0]">
                        {emergencyState === 'APPROACHING' && 'Ambulance approaching. Heavy congestion on MG Road.'}
                        {emergencyState === 'ALTERNATE CORRIDOR' && 'Rerouting ambulance. Priority corridor granted.'}
                        {emergencyState === 'ROUTE UPDATED' && 'Route updated in 184 ms — simulated.'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#F2F2F2] block font-medium">System Nominal</span>
                        <span className="text-[#A0A0A0]">All routing nodes operating within parameters.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="size-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#F2F2F2] block font-medium">Congestion Detected</span>
                        <span className="text-[#A0A0A0]">Heavy traffic reported on RT-5509 corridor.</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[#292929] bg-[#101010] p-3">
      <div className="flex items-center justify-between text-[#A0A0A0]">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        <Icon className="size-3.5 opacity-70" />
      </div>
      <div className="text-lg font-semibold tabular-nums text-[#F2F2F2]">
        {value}
      </div>
    </div>
  )
}

function InspectorItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">{label}</span>
      <span className={cn(
        "text-sm font-medium tabular-nums",
        highlight ? "text-emerald-400" : "text-[#F2F2F2]"
      )}>
        {value}
      </span>
    </div>
  )
}
