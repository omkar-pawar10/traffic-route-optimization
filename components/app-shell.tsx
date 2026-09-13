import Link from 'next/link'
import { ArrowRight, BrainCircuit, Route } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrafficMap } from '@/components/traffic-map'
import {
  appName,
  getRouteDescription,
  getRouteTitle,
  navigationItems,
  problemStatementId,
  prototypeDisclaimer,
  type AppRole,
} from '@/types/traffic'

export function AppShell({ role, children }: { role: AppRole; children?: React.ReactNode }) {
  const title = getRouteTitle(role)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/driver" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Route aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">{appName}</span>
              <span className="block text-xs text-muted-foreground">SIH {problemStatementId}</span>
            </span>
          </Link>
          <Badge variant="outline" className="hidden sm:inline-flex">{prototypeDisclaimer}</Badge>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid flex-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside aria-label="Workspace navigation" className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspaces</p>
              <nav className="mt-3 flex flex-col gap-1" aria-label="Workspace routes">
                {navigationItems.map((item) => {
                  const active = item.href === `/${role}`
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center justify-between rounded-lg border px-3 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-border bg-card text-foreground' : 'border-transparent text-muted-foreground hover:border-border hover:bg-card/60 hover:text-foreground'}`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  )
                })}
              </nav>
            </div>
            <Separator />
            <p className="text-xs leading-5 text-muted-foreground">Frontend foundation only. Live traffic, GPS, APIs, persistence, and a real optimization engine are intentionally excluded.</p>
          </aside>

          {children ? (
            children
          ) : (
            <section aria-labelledby="workspace-title" className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BrainCircuit aria-hidden="true" />
                  <span className="text-sm">Quantum-inspired route optimization</span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h1 id="workspace-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                  <Link
                    href={role === 'driver' ? '/operations' : '/driver'}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View {role === 'driver' ? 'operations' : 'driver'} route
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  {role === 'driver'
                    ? 'Review the recommended path for your vehicle class across the simulated network. Physical height, weight, and vehicle restrictions are always respected.'
                    : 'Monitor every vehicle-class route across the simulated network, with congestion, incidents, and physical restrictions surfaced on one operational map.'}
                </p>
              </div>

              <TrafficMap initialSelection={role === 'driver' ? 'passenger' : 'all'} />
            </section>
          )}
        </div>

        <footer className="mt-12 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          {appName} · {problemStatementId} · Frontend foundation
        </footer>
      </main>
    </div>
  )
}
