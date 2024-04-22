import { AuthorData } from '@/lib/digitalize'
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

export const Route = createLazyFileRoute('/app/metadata')({
  component: Metadata,
})

function AuthorTable({authors}: {authors: AuthorData}) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Function</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {authors.map((author, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{author.title}</TableCell>
            <TableCell>{author.name}</TableCell>
            <TableCell>{author.function}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Metadata() {
  const data = useDataStore((state) => state.data)
  if (!data) return <Navigate to="/" />
  return (
    <>
      <AuthorTable authors={data.authors} />
    </>
  )
}