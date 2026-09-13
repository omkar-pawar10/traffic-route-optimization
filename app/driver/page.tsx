import { AppShell } from '@/components/app-shell'
import { TrafficAppProvider } from '@/components/traffic-app-provider'

export default function DriverPage() {
  return (
    <TrafficAppProvider>
      <AppShell role="driver" />
    </TrafficAppProvider>
  )
}
