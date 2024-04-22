// System Designer
import { Navigate, createLazyFileRoute } from '@tanstack/react-router'
import { useDataStore } from '@/stores/data'
import { ModuleIntegratorTable } from '@/components/module-integrator-table'

export const Route = createLazyFileRoute('/app/module-integrator')({
  component: ModuleIntegrator,
})

function ModuleIntegrator() {
  const data = useDataStore((state) => state.data)
  if (!data) return <Navigate to="/" />
  return (
    <>
      <ModuleIntegratorTable data={data.mi} />
    </>
  )
}