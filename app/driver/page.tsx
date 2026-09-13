import { DriverExperience } from '@/components/driver-experience'
import { TrafficAppProvider } from '@/components/traffic-app-provider'

export default function DriverPage() {
  return (
    <TrafficAppProvider>
      <DriverExperience />
    </TrafficAppProvider>
  )
}
