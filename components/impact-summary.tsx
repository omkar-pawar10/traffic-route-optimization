import { Leaf, Clock, Fuel, ShieldCheck } from 'lucide-react'

// Constants for illustrative derived arithmetic
// Assuming each optimized route saves an average of 4.2 km in detour/congestion avoidance
const AVG_KM_SAVED_PER_ROUTE = 4.2
// Average fleet fuel efficiency (e.g. 15L / 100km)
const FUEL_L_PER_KM_SAVED = 0.15
// Standard diesel emissions: 2.68 kg CO2 per liter
const EMISSIONS_KG_PER_L = 2.68
// Average city speed to derive time saved from distance (e.g., 25 km/h)
const AVG_SPEED_KMH = 25 

export function ImpactSummary({ routeCount }: { routeCount: number }) {
  const kmSaved = routeCount * AVG_KM_SAVED_PER_ROUTE
  const fuelSaved = kmSaved * FUEL_L_PER_KM_SAVED
  const emissionsAvoided = fuelSaved * EMISSIONS_KG_PER_L
  const timeSavedHours = kmSaved / AVG_SPEED_KMH

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-lg border border-[#292929] bg-[#101010] p-4 mb-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-[#F2F2F2] flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-500" />
          Impact & Benefits
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm inline-flex items-center w-max">
          Simulated aggregate — illustrative only
        </span>
      </div>

      <div className="flex flex-wrap gap-6 mt-2 md:mt-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] flex items-center gap-1.5">
            <Fuel className="size-3" /> Est. fuel saved today
          </span>
          <span className="text-xl font-semibold tabular-nums text-emerald-400">{Math.round(fuelSaved)} L</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] flex items-center gap-1.5">
            <Clock className="size-3" /> Est. time saved today
          </span>
          <span className="text-xl font-semibold tabular-nums text-emerald-400">{Math.round(timeSavedHours * 60)} min</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] flex items-center gap-1.5">
            <Leaf className="size-3" /> Est. emissions avoided today
          </span>
          <span className="text-xl font-semibold tabular-nums text-emerald-400">{Math.round(emissionsAvoided)} kg CO₂</span>
        </div>
      </div>
    </div>
  )
}
