"use client";

import type { Data } from "@/components/json-table";
import * as React from "react";
import { useQuickSave } from "@/hooks/useQuickSave";
import { Button } from "@asterix/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@asterix/ui/dialog";
import { Input } from "@asterix/ui/input";
import { Label } from "@asterix/ui/label";
import { toast } from "sonner";

export function TableSaverModal({ data }: { data: Data[] }) {
  const [openSave, setOpenSave] = React.useState(false);

  const [name, setName] = React.useState("");

  const { tables } = useQuickSave();

  const undo = React.useCallback(
    (name: string) => {
      tables.remove(name);
      toast.success("Undo", {
        description: `${name} was removed correctly`,
      });
    },
    [tables],
  );

  const save = React.useCallback(
    (name: string, data: Data[]) => {
      if (tables.exists(name)) {
        toast.error("Name already exists", {
          description: `Name "${name}" already exists in cache use another name`,
        });
        return;
      }
      tables.add(name, data);
      toast.success("Saved", {
        description: `"${name}" saved into cache`,
        action: {
          label: "Undo",
          onClick: () => {
            undo(name);
          },
        },
      });
    },
    [tables, undo],
  );

  return (
    <Dialog
      open={openSave}
      onOpenChange={(v) => {
        setOpenSave(v);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">Save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick save</DialogTitle>
          <DialogDescription>
            Quick save should not be used as persistent storage. You should use
            it to transfer easely in same sessions tables within the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="cid revision table"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              save(name, data);
              setOpenSave(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
