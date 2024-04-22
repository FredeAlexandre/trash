"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ModuleIntegratorData } from "@/lib/digitalize"
import { cn } from "@/lib/utils"

export const columns = (data: ModuleIntegratorData): ColumnDef<ModuleIntegratorData["data"][number]>[] => ([
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("designation")}</div>
    ),
    enableHiding: false
  },
  {
    accessorKey: "acronym",
    header: "Acronym",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("acronym")}</div>
    ),
    enableHiding: false
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reference")}</div>
    ),
    enableHiding: false
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("author")}</div>
    ),
    enableHiding: false,
  },
  ...data.baselines.map((baseline, index) => ({
    id: baseline.key,
    accessorKey: baseline.key,
    header: baseline.name,
    cell: ({ row }: { row: Row<ModuleIntegratorData["data"][number]>}) => {
      let result = row.original.references[baseline.key]
      let i
      for (i = index; i >= 0 && result == ""; i--) {
        result = row.original.references[data.baselines[index - i].key]
      }

      if (index == 0 || index - i == 0)
        return <div>{result}</div>

      const isSameAsPrevious = result == row.original.references[data.baselines[index - i - 1].key]

      if (!isSameAsPrevious) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className={cn({"text-blue-600": isSameAsPrevious})}>{result}</TooltipTrigger>
              <TooltipContent>
                <p>From baseline {data.baselines[index - i].name} ({row.original.references[data.baselines[index - i - 1].key]})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      } else {
        return <div>{result}</div>
      }
    }
  }))
])

export function ModuleIntegratorTable({data}: {data: ModuleIntegratorData}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const columnsWithData = columns(data)
  const keys = columnsWithData.map((column) => {
    return column.id
  }).filter((keys) => {
    return !!keys
  }) as string[]

  const [selectedVersion, setSelectedVersion] = React.useState<string>(keys[keys.length - 1])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})


  React.useEffect(() => {
    const visibility: Record<string, boolean> = {}
    keys.forEach((key) => {
      visibility[key] = false
    })
    visibility[selectedVersion] = true

    setColumnVisibility(visibility)
  }, [selectedVersion])

  const table = useReactTable({
    data: data.data,
    columns: columnsWithData,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter designation..."
          value={(table.getColumn("designation")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("designation")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select onValueChange={(e) => {
            setSelectedVersion(e)
          }}>
          <SelectTrigger className="w-[280px] ml-auto">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return <SelectItem key={column.id} value={column.id}>{column.id}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
