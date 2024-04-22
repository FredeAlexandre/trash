"use client";

import { Dir } from "fs";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Node, Tree, useStoreTree } from "@/stores/useStoreTree";
import { Button } from "@asterix/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@asterix/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@asterix/ui/resizable";
import { File, Folder } from "lucide-react";

function NodeDisplay({ node }: { node: Node }) {
  if ("children" in node) {
    return (
      <Collapsible className="truncate">
        <CollapsibleTrigger>{node.name}</CollapsibleTrigger>
        <CollapsibleContent>
          Yes. Free to use for personal and commercial projects. No attribution
          required.
        </CollapsibleContent>
      </Collapsible>
    );
  } else {
    return <li className="truncate">{node.name}</li>;
  }
}

function TreeDisplay({ tree }: { tree?: Tree | null }) {
  if (!tree) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ul className="h-screen w-[14rem] space-y-1 border-r p-2 text-xs">
        {tree.map((node) => (
          <NodeDisplay key={node.path} node={node} />
        ))}
      </ul>
    </>
  );
}

function FileNode({
  node,
  padding,
}: {
  node: { name: string; path: string };
  padding: number;
}) {
  return (
    <li className="truncate" style={{ paddingLeft: padding * 0.75 + "rem" }}>
      <File className="inline" size={10} /> {node.name}
    </li>
  );
}

function DirectoryNode({
  node,
  padding,
}: {
  node: { name: string; path: string; children: Tree };
  padding: number;
}) {
  return (
    <li style={{ paddingLeft: padding * 0.75 + "rem" }}>
      <Collapsible>
        <CollapsibleTrigger className="truncate">
          <Folder className="inline" size={10} /> {node.name}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RecursiveTreeNode padding={padding + 1} tree={node.children} />
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

function treeSortByType(nodeA: Node, nodeB: Node) {
  const isNodeADirectory = "children" in nodeA;
  const isNodeBDirectory = "children" in nodeB;
  if (isNodeADirectory && !isNodeBDirectory) {
    return -1;
  } else if (!isNodeADirectory && isNodeBDirectory) {
    return 1;
  }
  return 0;
}

function treeSortByName(nodeA: Node, nodeB: Node) {
  return nodeA.name.localeCompare(nodeB.name);
}

function RecursiveTreeNode({
  tree,
  padding = 0,
}: {
  tree: Tree;
  padding?: number;
}) {
  return (
    <ul>
      {tree
        .sort(treeSortByName)
        .sort(treeSortByType)
        .sort()
        .map((node) =>
          "children" in node ? (
            <DirectoryNode key={node.path} node={node} padding={padding} />
          ) : (
            <FileNode key={node.path} node={node} padding={padding} />
          ),
        )}
    </ul>
  );
}

function TreeViewer({ tree }: { tree: Tree }) {
  if (!tree) return null;
  return (
    <div className="w-full space-y-2 border-r p-2 text-xs">
      <RecursiveTreeNode tree={tree} />
    </div>
  );
}

export default function Workspace() {
  const router = useRouter();
  const treeStore = useStoreTree();
  const tree = treeStore.tree;

  React.useEffect(() => {
    if (!tree) {
      return router.push("/");
    }
  }, []);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ResizablePanelGroup className="flex-grow" direction="horizontal">
          <ResizablePanel className="relative">
            <TreeViewer tree={tree!} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>The rest</ResizablePanel>
        </ResizablePanelGroup>
        <div className="h-9 w-full border-t"></div>
      </div>
    </>
  );
}
