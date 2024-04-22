import type { Data } from "@/components/json-table";

export function toTable(raw: string[][]) {
  const keys = raw[0].map((key) => key.trim().replaceAll(".", "_"));

  const data: Data[] = [];

  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];

    const obj: Data = {};

    for (let j = 0; j < keys.length; j++) {
      obj[keys[j]] = row[j];
    }

    data.push(obj);
  }

  return data;
}
