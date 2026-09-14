'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Activity, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlgorithmId = 'QPSO' | 'Dijkstra' | 'GA' | 'ACO' | 'PSO'

interface AlgorithmData {
  id: AlgorithmId
  name: string
  isDemoEngine?: boolean
  timeSeries: { iteration: string; time: number }[]
  gapSeries: { iteration: string; gap: number }[]
  finalTime: number
  finalGap: string
  iterations: string
}

const algorithms: AlgorithmData[] = [
  {
    id: 'QPSO',
    name: 'Quantum-behaved PSO',
    isDemoEngine: true,
    timeSeries: [
      { iteration: 'Run 1', time: 184 },
      { iteration: 'Run 2', time: 172 },
      { iteration: 'Run 3', time: 161 },
      { iteration: 'Run 4', time: 153 },
      { iteration: 'Run 5', time: 148 },
    ],
    gapSeries: [
      { iteration: 'Iter 10', gap: 8.2 },
      { iteration: 'Iter 20', gap: 5.4 },
      { iteration: 'Iter 30', gap: 3.1 },
      { iteration: 'Iter 40', gap: 1.8 },
      { iteration: 'Iter 50', gap: 1.1 },
    ],
    finalTime: 184,
    finalGap: '1.1%',
    iterations: '31',
  },
  {
    id: 'Dijkstra',
    name: 'Dijkstra (Exact)',
    timeSeries: [
      { iteration: 'Run 1', time: 96 },
      { iteration: 'Run 2', time: 96 },
      { iteration: 'Run 3', time: 96 },
      { iteration: 'Run 4', time: 96 },
      { iteration: 'Run 5', time: 96 },
    ],
    gapSeries: [
      { iteration: 'Iter 10', gap: 0 },
      { iteration: 'Iter 20', gap: 0 },
      { iteration: 'Iter 30', gap: 0 },
      { iteration: 'Iter 40', gap: 0 },
      { iteration: 'Iter 50', gap: 0 },
    ],
    finalTime: 96,
    finalGap: '0%',
    iterations: 'N/A',
  },
  {
    id: 'GA',
    name: 'Genetic Algorithm',
    timeSeries: [
      { iteration: 'Run 1', time: 210 },
      { iteration: 'Run 2', time: 198 },
      { iteration: 'Run 3', time: 184 },
      { iteration: 'Run 4', time: 176 },
      { iteration: 'Run 5', time: 169 },
    ],
    gapSeries: [
      { iteration: 'Iter 10', gap: 10.5 },
      { iteration: 'Iter 20', gap: 7.8 },
      { iteration: 'Iter 30', gap: 5.9 },
      { iteration: 'Iter 40', gap: 4.2 },
      { iteration: 'Iter 50', gap: 3.0 },
    ],
    finalTime: 210,
    finalGap: '3.0%',
    iterations: '50',
  },
  {
    id: 'ACO',
    name: 'Ant Colony Optimization',
    timeSeries: [
      { iteration: 'Run 1', time: 225 },
      { iteration: 'Run 2', time: 207 },
      { iteration: 'Run 3', time: 192 },
      { iteration: 'Run 4', time: 181 },
      { iteration: 'Run 5', time: 173 },
    ],
    gapSeries: [
      { iteration: 'Iter 10', gap: 12.1 },
      { iteration: 'Iter 20', gap: 9.2 },
      { iteration: 'Iter 30', gap: 6.8 },
      { iteration: 'Iter 40', gap: 5.1 },
      { iteration: 'Iter 50', gap: 3.8 },
    ],
    finalTime: 225,
    finalGap: '3.8%',
    iterations: '50',
  },
  {
    id: 'PSO',
    name: 'Standard PSO',
    timeSeries: [
      { iteration: 'Run 1', time: 201 },
      { iteration: 'Run 2', time: 187 },
      { iteration: 'Run 3', time: 176 },
      { iteration: 'Run 4', time: 168 },
      { iteration: 'Run 5', time: 161 },
    ],
    gapSeries: [
      { iteration: 'Iter 10', gap: 9.8 },
      { iteration: 'Iter 20', gap: 7.0 },
      { iteration: 'Iter 30', gap: 5.2 },
      { iteration: 'Iter 40', gap: 3.9 },
      { iteration: 'Iter 50', gap: 2.8 },
    ],
    finalTime: 201,
    finalGap: '2.8%',
    iterations: '50',
  },
]

export function OptimizationAnalysis() {
  const [selectedAlg, setSelectedAlg] = useState<AlgorithmId>('QPSO')
  const data = algorithms.find((a) => a.id === selectedAlg)!

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-[#292929] bg-[#101010] p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-[#F2F2F2] flex items-center gap-2">
            <Zap className="size-4 text-[#A0A0A0]" />
            Optimization Analysis
          </h2>
          <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm inline-flex items-center w-max">
            Simulated Data
          </span>
        </div>
        <div className="flex gap-1.5 bg-[#151515] p-1 rounded-md border border-[#292929]">
          {algorithms.map((alg) => (
            <button
              key={alg.id}
              onClick={() => setSelectedAlg(alg.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selectedAlg === alg.id
                  ? 'bg-[#292929] text-[#F2F2F2] shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#F2F2F2] hover:bg-[#1B1B1B]'
              )}
            >
              {alg.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Left Column: Metrics & Info */}
        <div className="flex flex-col gap-4 col-span-1">
          <div className="flex flex-col gap-4 rounded-lg border border-[#292929] bg-[#101010] p-4 h-full">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Selected Algorithm</span>
              <h3 className="text-lg font-semibold text-[#F2F2F2]">{data.name}</h3>
              {data.isDemoEngine && (
                <span className="text-xs text-blue-400 mt-1 flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md w-max">
                  Demo Engine
                </span>
              )}
              {data.id === 'Dijkstra' && (
                <span className="text-xs text-[#A0A0A0] mt-1 leading-relaxed">
                  Exact result for the static objective demonstration network.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <MetricItem label="Optimization Time" value={`${data.finalTime} ms`} />
              <MetricItem label="Convergence Gap" value={data.finalGap} />
              <MetricItem label="Iterations" value={data.iterations} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#292929]">
              <div className="flex items-start gap-2 text-[10px] text-[#808080] uppercase tracking-wider">
                <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                <span>Demonstration values only — not live optimization output.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-3">
          <div className="flex flex-col flex-1 min-h-[200px] rounded-lg border border-[#292929] bg-[#101010] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#F2F2F2]">Optimization Time Trajectory</span>
              <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Simulated</span>
            </div>
            <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292929" vertical={false} />
                  <XAxis 
                    dataKey="iteration" 
                    stroke="#A0A0A0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#A0A0A0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={['dataMin - 20', 'dataMax + 20']}
                  />
                  <Tooltip 
                    cursor={{ fill: '#1B1B1B' }}
                    contentStyle={{ backgroundColor: '#151515', borderColor: '#292929', fontSize: '12px', color: '#F2F2F2' }}
                    itemStyle={{ color: '#F2F2F2' }}
                  />
                  <Bar dataKey="time" name="Time (ms)" fill="#4A4A4A" radius={[2, 2, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-[200px] rounded-lg border border-[#292929] bg-[#101010] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#F2F2F2]">Convergence / Gap Reduction</span>
              <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Simulated</span>
            </div>
            <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.gapSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292929" vertical={false} />
                  <XAxis 
                    dataKey="iteration" 
                    stroke="#A0A0A0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#A0A0A0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={data.id === 'Dijkstra' ? [0, 1] : ['dataMin - 1', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151515', borderColor: '#292929', fontSize: '12px', color: '#F2F2F2' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gap" 
                    name="Gap (%)" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ fill: '#1B1B1B', stroke: '#3b82f6', strokeWidth: 1, r: 2 }} 
                    activeDot={{ r: 4, fill: '#3b82f6' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">{label}</span>
      <span className="text-xl font-semibold tabular-nums text-[#F2F2F2]">
        {value}
      </span>
    </div>
  )
}
