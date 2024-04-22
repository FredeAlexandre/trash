"use client";

import type { Data } from "@/components/json-table";
import * as React from "react";
import { useLocalStorage } from "usehooks-ts";

export function useTableQuickSave() {
  const [tables, setTables] = useLocalStorage<Record<string, Data[]>>(
    "table-quick-save",
    {},
    { initializeWithValue: false },
  );

  const add = React.useCallback(
    (name: string, data: Data[]) => {
      setTables({ ...tables, [name]: data });
    },
    [tables, setTables],
  );

  const remove = React.useCallback(
    (name: string) => {
      const { [name]: _, ...rest } = tables;
      setTables(rest);
    },
    [tables, setTables],
  );

  const rename = React.useCallback(
    (name: string, updateName: string) => {
      const data = tables[name];
      const { [name]: _, ...rest } = tables;
      setTables({ ...rest, [updateName]: data });
    },
    [tables, setTables],
  );

  const exists = React.useCallback(
    (name: string) => {
      return !!tables[name];
    },
    [tables],
  );

  return { data: tables, add, remove, set: setTables, exists, rename };
}

export function useQuickSave() {
  const tables = useTableQuickSave();

  return { tables };
}
