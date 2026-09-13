import { AppShell } from '@/components/app-shell'
import { TrafficAppProvider } from '@/components/traffic-app-provider'

export default function OperationsPage() {
  return (
    <TrafficAppProvider>
      <AppShell role="operations" />
    </TrafficAppProvider>
  )
}
