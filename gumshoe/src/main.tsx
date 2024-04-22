import { DndContext } from "@dnd-kit/core";
import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider";

import "./index.css";

import { App } from "./App";
import { BreakpointsDisplay } from "./components/breakpoints-display";
import { CoordinatesCursor } from "./components/coordinates-cursor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DndContext>
        {import.meta.env.DEV ? <CoordinatesCursor /> : null}
        {import.meta.env.DEV ? <BreakpointsDisplay /> : null}
        <App />
      </DndContext>
    </ThemeProvider>
  </React.StrictMode>,
);
