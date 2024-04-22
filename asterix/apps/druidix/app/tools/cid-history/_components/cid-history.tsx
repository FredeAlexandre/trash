"use client";

import type { Data } from "@/components/json-table";
import * as React from "react";
import { JsonTable } from "@/components/json-table";
import { useTableQuickSave } from "@/hooks/useQuickSave";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@asterix/ui/select";

export function CidHistory() {
  const [table, setTable] = React.useState<Data[]>();

  const { data } = useTableQuickSave();

  const entries = React.useMemo(() => {
    return Object.entries(data);
  }, [data]);

  return (
    <div className="flex flex-col items-center space-y-6 py-10">
      {entries.length > 0 ? (
        <div className="w-[20rem]">
          <Select
            onValueChange={(v) => {
              entries.forEach(([key, value]) => {
                if (key == v) {
                  setTable(value);
                }
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the CID" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {entries.map(([key]) => {
                  return (
                    <SelectItem value={key} key={key}>
                      {key}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>No tables found</>
      )}
      <hr />
      {table ? <JsonTable data={table} /> : <></>}
    </div>
  );
}
