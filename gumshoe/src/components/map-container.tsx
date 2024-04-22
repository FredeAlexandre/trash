import * as React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

function Content({ x, y }: { x: number; y: number; scale: number }) {
  const [items, setItems] = React.useState<{ x: number; y: number }[]>([]);

  return (
    <TransformComponent wrapperStyle={{ width: "100%", height: "100dvh" }}>
      <div
        onClick={(e) => {
          const pos = { x: e.clientX - x, y: e.clientY - y };
          setItems([...items, pos]);
        }}
        className="relative flex h-[32rem] w-[32rem] items-center justify-center border bg-card"
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: item.y,
              left: item.x,
              width: "2px",
              height: "2px",
              background: "red",
            }}
          />
        ))}
      </div>
    </TransformComponent>
  );
}

export function MapContainer({ left }: { left: number }) {
  const [state, setState] = React.useState({ x: 0, y: 0, scale: 1 });

  return (
    <TransformWrapper
      onTransformed={(_, state) => {
        setState({
          x: state.positionX + left,
          y: state.positionY,
          scale: state.scale,
        });
      }}
      centerOnInit
    >
      <Content {...state} />
    </TransformWrapper>
  );
}
