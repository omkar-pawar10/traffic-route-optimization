import { AppShell } from '@/components/app-shell'
import { TrafficAppProvider } from '@/components/traffic-app-provider'
import { OperationsDashboard } from '@/components/operations-dashboard'

export default function OperationsPage() {
  return (
    <TrafficAppProvider>
      <AppShell role="operations">
        <OperationsDashboard />
      </AppShell>
    </TrafficAppProvider>
  )
}
