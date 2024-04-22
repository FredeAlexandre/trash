"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@asterix/ui/select";

export function SelectRoute({ routes }: { routes: string[] }) {
  const router = useRouter();

  const [type, setType] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (type === undefined) return;
    router.push(`/tools/type-factory/${type}`);
  }, [type, router]);

  return (
    <Select
      value={type}
      onValueChange={(v) => {
        setType(v);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {routes.map((route) => (
          <SelectItem key={route} value={route}>
            {route}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
