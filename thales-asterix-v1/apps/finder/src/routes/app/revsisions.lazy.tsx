import { RevisionData } from '@/lib/digitalize'
import { useDataStore } from '@/stores/data'
import { Navigate, createLazyFileRoute } from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const Route = createLazyFileRoute('/app/revsisions')({
  component: Revisions,
})

function RevisionsTable({revisions}: {revisions: RevisionData}) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Author</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {revisions.map((revision, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{revision.issue}</TableCell>
            <TableCell>{revision.date}</TableCell>
            <TableCell>{revision.description}</TableCell>
            <TableCell>{revision.author}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Revisions() {
  const data = useDataStore((state) => state.data)
  if (!data) return <Navigate to="/" />
  return (
    <>
      <RevisionsTable revisions={data.revisions} />
    </>
  )
}