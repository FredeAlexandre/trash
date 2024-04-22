import * as React from "react";
import { useEventListener } from "usehooks-ts";

export function CoordinatesCursor() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  useEventListener("mousemove", (event) => {
    setPos({ x: event.clientX, y: event.clientY });
  });

  return (
    <div
      className="fixed z-50 select-none rounded border bg-card p-1 text-xs"
      style={{ left: pos.x + 10, top: pos.y + 10 }}
    >
      x: {pos.x}, y: {pos.y}
    </div>
  );
}
