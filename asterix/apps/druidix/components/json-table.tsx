"use client";

import type { NativeType } from "@asterix/schemas";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@asterix/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type Data = Record<string, NativeType>;

function getColumns<T extends Data[]>(data: T, _: boolean): ColumnDef<Data>[] {
  if (!data.length) return [];
  const first_row = data[0];

  const keys = Object.keys(first_row);

  const colmuns = keys.map((key) => ({
    accessorKey: key,
    header: key,
  }));

  return colmuns;
}

export function JsonTable<T extends Data[]>({
  data,
  canEdit = false,
}: {
  data: T;
  canEdit?: boolean;
  onDataChange?: (data: T) => void;
}) {
  const columns = React.useMemo(
    () => getColumns(data, canEdit),
    [data, canEdit],
  );
  const table = useReactTable<Data>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) return null;

  return (
    <div className="w-full rounded-md border">
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
                          header.getContext(),
                        )}
                  </TableHead>
                );
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
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
