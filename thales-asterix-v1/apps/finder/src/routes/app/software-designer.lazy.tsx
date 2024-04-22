// System Designer
import { Navigate, createLazyFileRoute } from '@tanstack/react-router'
import { SoftwareDevelopmentTable } from '@/components/software-development-table'
import { useDataStore } from '@/stores/data'

export const Route = createLazyFileRoute('/app/software-designer')({
  component: SoftwareDesigner,
})

function SoftwareDesigner() {
  const data = useDataStore((state) => state.data)
  if (!data) return <Navigate to="/" />
  return (
    <>
      <SoftwareDevelopmentTable data={data.sd} />
    </>
  )
}