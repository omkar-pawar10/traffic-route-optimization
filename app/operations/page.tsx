import { AppShell } from '@/components/app-shell'
import { OperationsDashboard } from '@/components/operations-dashboard'

export default function OperationsPage() {
  return (
    <AppShell role="operations">
      <OperationsDashboard />
    </AppShell>
  )
}
