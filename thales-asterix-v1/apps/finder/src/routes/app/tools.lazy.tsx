import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/tools')({
  component: Tools,
})

function Tools() {
  return (
    <>
      Tools
    </>
  )
}