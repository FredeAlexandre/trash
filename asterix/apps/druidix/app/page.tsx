"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@asterix/ui/button";
import { Input } from "@asterix/ui/input";
import { Label } from "@asterix/ui/label";
import { ArrowRightIcon, UploadIcon } from "@radix-ui/react-icons";

import type { Tree } from "../stores/useStoreTree";
import { useStoreTree } from "../stores/useStoreTree";

export default function Home() {
  const router = useRouter();
  const treeStore = useStoreTree();

  const openDirectory = React.useCallback(async () => {
    // @ts-expect-error electron is not in ts
    const result: string = await window.electron.invoke("dialog:openDirectory");
    if (!result) return;
    try {
      // @ts-expect-error electron is not in ts
      const tree: Tree = await window.electron.invoke("tree-directory", result);
      treeStore.setTree(tree);
      router.push(`/workspace`);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const [directory, setDirectory] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-center pt-20">
      <h1 className="font-mono text-2xl font-bold uppercase">Druidix</h1>
      <p className="text-muted-foreground">
        Digitalize the data from the IMA process
      </p>

      <div className="w-[400px] space-y-4 pt-6">
        <div className="w-full space-y-1 px-2">
          <Label className="text-muted-foreground">Load from server</Label>
          <div className="relative">
            <Input type="url" placeholder="https://osa-ima.thales.intra/..." />
            <Button size="icon" className="absolute right-1 top-1 h-7 w-7">
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
        <hr />
        <div className="w-full space-y-1 px-2">
          <Label className="text-muted-foreground">Open from local</Label>
          <div className="relative">
            <button
              onClick={openDirectory}
              className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="truncate pr-8 text-muted-foreground">
                {directory == null ? "No directory selected" : directory}
              </span>
            </button>
            <Button
              onClick={openDirectory}
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
            >
              <UploadIcon />
            </Button>
          </div>
        </div>
        <hr />
        <div className="w-full space-y-1 px-2">
          <Label className="text-muted-foreground">Create workspace</Label>
          <Button className="h-8 w-full">Create workspace</Button>
        </div>
      </div>

      <div className="pt-10">
        <p className="text-muted-foreground">
          If you searching for tools you can go to{" "}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-primary"
          >
            Tools <ArrowRightIcon />
          </Link>
        </p>
      </div>
    </div>
  );
}
