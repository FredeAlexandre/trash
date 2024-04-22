import { Navigate, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/')({
  component: Index,
})

function Index() {
  return (<Navigate to="/app/metadata" />)
}