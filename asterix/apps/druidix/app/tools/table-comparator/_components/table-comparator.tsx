"use client";

import type { Data } from "@/components/json-table";
import * as React from "react";
import { useQuickSave } from "@/hooks/useQuickSave";
import { cn } from "@asterix/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@asterix/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@asterix/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@asterix/ui/table";
import { ArrowRight } from "lucide-react";

function isSameArray<T>(arr1: T[], arr2: T[]) {
  return arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);
}

function Comparator({ tableA, tableB }: { tableA?: Data[]; tableB?: Data[] }) {
  if (!tableA || !tableB) {
    return null;
  }

  const keysA = Object.keys(tableA[0]);
  const keysB = Object.keys(tableB[0]);

  if (!isSameArray(keysA, keysB)) {
    return (
      <div className="text-center text-red-500">
        The tables have different columns
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {keysA.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableB.map((row, i) => {
            const rowA = tableA[i];
            return (
              <TableRow key={i}>
                {keysA.map((key) => {
                  if (row[key] === rowA[key]) {
                    return <TableCell key={key}>{row[key]}</TableCell>;
                  } else {
                    return (
                      <Popover key={key}>
                        <TableCell>
                          <PopoverTrigger
                            className={cn("text-left", {
                              "text-blue-500": row[key] !== rowA[key],
                            })}
                          >
                            {row[key]}
                          </PopoverTrigger>
                        </TableCell>
                        <PopoverContent className="flex w-fit max-w-[64rem] items-center gap-2 p-2 text-xs">
                          <div>{rowA[key]}</div>
                          <ArrowRight size={10} />
                          <div className="text-blue-500">{row[key]}</div>
                        </PopoverContent>
                      </Popover>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableComparator() {
  const { tables } = useQuickSave();

  const [tableA, setTableA] = React.useState<Data[] | undefined>();
  const [tableB, setTableB] = React.useState<Data[] | undefined>();

  return (
    <div className="space-y-6 py-10">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Select
            onValueChange={(v) => {
              setTableA(tables.data[v]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a table saved" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tables</SelectLabel>
                {Object.entries(tables.data).map(([key]) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ArrowRight size={16} />
        <div className="flex-1 space-y-2">
          <Select
            onValueChange={(v) => {
              setTableB(tables.data[v]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a table saved" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tables</SelectLabel>
                {Object.entries(tables.data).map(([key]) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <hr />
      <Comparator tableA={tableA} tableB={tableB} />
    </div>
  );
}
