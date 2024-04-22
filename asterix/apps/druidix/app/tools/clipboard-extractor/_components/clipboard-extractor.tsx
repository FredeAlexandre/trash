"use client";

import * as React from "react";
import { toTable } from "@/app/lib/to-table";
import { JsonTable } from "@/components/json-table";
import { TableSaverModal } from "@/components/table-saver-modal";
import { Label } from "@asterix/ui/label";
import { Textarea } from "@asterix/ui/textarea";

function extractDataFromClipboard(clipboard: string) {
  return toTable(
    clipboard.split("\n").map((line) => {
      return line.split("\t");
    }),
  );
}

export function ClipboardExtractor() {
  const [clipboard, setClipboard] = React.useState("");

  const data = React.useMemo(
    () => extractDataFromClipboard(clipboard),
    [clipboard],
  );
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clipboard">Clipboard</Label>
        <Textarea
          value={clipboard}
          onChange={(e) => {
            setClipboard(e.target.value);
          }}
          id="clipboard"
          rows={10}
        />
      </div>
      <hr />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="clipboard">Table</Label>
          {data.length > 0 && <TableSaverModal data={data} />}
        </div>
        <JsonTable data={data} />
      </div>
    </div>
  );
}
