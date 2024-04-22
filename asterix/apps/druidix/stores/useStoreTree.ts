import { create } from "zustand";

export type Tree = (
  | { name: string; path: string }
  | { name: string; path: string; children: Tree }
)[];

export type Node = Tree[0];

interface TreeStore {
  tree: Tree | null;
  setTree: (tree: Tree) => void;
}

export const useStoreTree = create<TreeStore>((set) => ({
  tree: null,
  setTree: (tree) => set({ tree }),
}));
