"use client";

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
import { Popover, PopoverContent, PopoverTrigger } from "@asterix/ui/popover";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

export function CacheManager() {
  const { tables } = useQuickSave();

  const [updateName, setUpdateName] = React.useState("");

  return (
    <div>
      <div className="space-y-2">
        <h1>Tables Cache</h1>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(tables.data).map(([name]) => (
            <Popover key={name}>
              <PopoverTrigger asChild>
                <Button variant="outline">{name}</Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-fit gap-2 p-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Pencil1Icon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit</DialogTitle>
                      <DialogDescription>
                        Update the name of the table
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={updateName}
                          onChange={(e) => {
                            setUpdateName(e.target.value);
                          }}
                          placeholder="not cid revision table ?"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => {
                          if (updateName === "") return;
                          tables.rename(name, updateName);
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="icon" variant="outline">
                  <EyeOpenIcon />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    tables.remove(name);
                  }}
                >
                  <TrashIcon />
                </Button>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
