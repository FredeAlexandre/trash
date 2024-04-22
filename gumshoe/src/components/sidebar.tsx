import { RefreshCcw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

export const Sidebar = React.forwardRef<HTMLDivElement>(function Sidebar(
  {},
  ref,
) {
  return (
    <div ref={ref} className="h-screen space-y-4 p-2">
      <div className="flex gap-2">
        <Button variant="outline" className="flex-grow">
          Map Selection
        </Button>
        <Button variant="outline" size="icon">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold">Characters</span>
        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold">Tools</span>
        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
          <div className="h-10 w-10 rounded bg-white" />
        </div>
      </div>
    </div>
  );
});
