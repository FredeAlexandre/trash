import * as React from "react";
import { useResizeObserver } from "usehooks-ts";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { MapContainer } from "./components/map-container";
import { Sidebar } from "./components/sidebar";

export function App() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({
    ref,
    box: "border-box",
  });

  return (
    <ResizablePanelGroup className="h-dvh" direction="horizontal">
      <ResizablePanel minSize={18} defaultSize={18}>
        <Sidebar ref={ref} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={82}>
        <MapContainer left={width} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
