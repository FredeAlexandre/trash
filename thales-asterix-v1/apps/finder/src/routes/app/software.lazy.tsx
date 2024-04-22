import { SoftwareTable } from '@/components/software-table'
import { useDataStore } from '@/stores/data'
import { Navigate, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/software')({
  component: Software,
})

function Software() {
  const data = useDataStore((state) => state.data)
  if (!data) return <Navigate to="/" />
  return (
    <>
      <SoftwareTable data={data.sw} />
    </>
  )
}