'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Fuel,
  Gauge as GaugeIcon,
  LayoutDashboard,
  Package,
  Route,
  Search,
  Settings,
  ShieldAlert,
  Truck,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterPills } from '@/components/ui/filter-pills'
import { Gauge } from '@/components/ui/gauge'
import { Input } from '@/components/ui/input'
import { MetricPill } from '@/components/ui/metric-pill'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/ui/status-badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconRail } from '@/components/icon-rail'
import { appName, problemStatementId } from '@/types/traffic'

const filterOptions = [
  { value: 'all', label: 'All', count: 10 },
  { value: 'active', label: 'Active', count: 6 },
  { value: 'idle', label: 'Idle', count: 2 },
  { value: 'maintenance', label: 'Maintenance', count: 1 },
  { value: 'offline', label: 'Offline', count: 1 },
]

const railItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'cargo', label: 'Cargo', icon: Package },
  { id: 'alerts', label: 'Alerts', icon: ShieldAlert },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <Card size="sm" className="ring-border/70">
        <CardContent className="flex flex-wrap items-center gap-3">{children}</CardContent>
      </Card>
    </section>
  )
}

export default function StyleGuidePage() {
  const [filter, setFilter] = useState('all')
  const [activeRail, setActiveRail] = useState('dashboard')
  const [showRoutes, setShowRoutes] = useState(true)
  const [showAlerts, setShowAlerts] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/driver"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to workspace
          </Link>
          <Badge variant="outline">{problemStatementId}</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{appName} design system</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Component reference</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Shared visual language and reusable primitives for the traffic-control workspace: dense status indicators,
            compact controls, and instrument-style readouts, built for a real operations product rather than a generic
            SaaS dashboard.
          </p>
        </div>

        <Section title="Status badges" description="Muted, dot-led indicators for vehicle, driver, and package state across list rows and headers.">
          <StatusBadge tone="success">Active</StatusBadge>
          <StatusBadge tone="neutral">Idle</StatusBadge>
          <StatusBadge tone="warning">Maintenance</StatusBadge>
          <StatusBadge tone="critical">Offline</StatusBadge>
          <StatusBadge tone="info">In transit</StatusBadge>
          <Separator orientation="vertical" className="h-5" />
          <StatusBadge tone="success" showDot={false}>Low risk</StatusBadge>
          <StatusBadge tone="warning" showDot={false}>Medium risk</StatusBadge>
          <StatusBadge tone="critical" showDot={false}>High risk</StatusBadge>
        </Section>

        <Section title="Metric pills" description="Compact icon + label + value chips for summary toolbars, e.g. fleet counts and utilization.">
          <MetricPill icon={Truck} label="Active" value="6/10" />
          <MetricPill icon={Users} label="Drivers" value="6/8" />
          <MetricPill icon={Route} label="Trips" value={5} />
          <MetricPill icon={Fuel} label="Avg fuel" value="56.2%" />
          <MetricPill icon={GaugeIcon} label="On-time" value="94.2%" />
        </Section>

        <Section title="Filter pills" description="Segmented, count-aware filter control for status-driven list views.">
          <FilterPills options={filterOptions} value={filter} onValueChange={setFilter} />
        </Section>

        <Section title="Gauges" description="Radial instrument readouts for live telemetry such as speed, fuel level, and load.">
          <Gauge value={53} max={90} label="Speed" unit="mph" tone="success" />
          <Gauge value={24} max={100} label="Fuel level" unit="%" tone="warning" />
          <Gauge value={92} max={100} label="Route risk" unit="score" tone="critical" />
        </Section>

        <Section title="Icon rail" description="Narrow, icon-only navigation rail with tooltip labels for dense workspace layouts.">
          <IconRail items={railItems} activeId={activeRail} onSelect={setActiveRail} />
        </Section>

        <Section title="Toggles" description="Compact switches paired with a label, used for map overlays and quick preferences.">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show routes</span>
            <Switch checked={showRoutes} onCheckedChange={setShowRoutes} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show alerts</span>
            <Switch checked={showAlerts} onCheckedChange={setShowAlerts} />
          </div>
        </Section>

        <Section title="Search and breadcrumb" description="Compact input density and breadcrumb trail for nested vehicle and trip records.">
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input placeholder="Search vehicles, trips..." className="pl-8" />
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations" className="text-xs">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations" className="text-xs">Fleet vehicles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">TX-4821-HX</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Section>

        <Section title="Tabs" description="Underline tab style for switching between record views (overview, cargo, trips, alerts).">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cargo">Cargo</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-xs text-muted-foreground">Vehicle overview content.</TabsContent>
            <TabsContent value="cargo" className="pt-3 text-xs text-muted-foreground">Cargo layout content.</TabsContent>
            <TabsContent value="trips" className="pt-3 text-xs text-muted-foreground">Trip history content.</TabsContent>
            <TabsContent value="alerts" className="pt-3 text-xs text-muted-foreground">Alert log content.</TabsContent>
          </Tabs>
        </Section>

        <Section title="Surfaces" description="Layered surface hierarchy: sunken background, base card, and raised card for nested panels.">
          <div className="flex w-full flex-wrap gap-3">
            <div className="flex h-16 flex-1 items-center justify-center rounded-lg border border-border/70 bg-surface-sunken text-xs text-muted-foreground">
              surface-sunken
            </div>
            <div className="flex h-16 flex-1 items-center justify-center rounded-lg border border-border/70 bg-card text-xs text-muted-foreground">
              card
            </div>
            <div className="flex h-16 flex-1 items-center justify-center rounded-lg border border-border/70 bg-surface-raised text-xs text-muted-foreground">
              surface-raised
            </div>
          </div>
        </Section>

        <Card size="sm" className="border-dashed bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm">Reference only</CardTitle>
            <CardDescription>
              This page documents primitives for the driver and operations workspaces. No product screens have been
              assembled yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  )
}
