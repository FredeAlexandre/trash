"use client";

import type { Data } from "@/components/json-table";
import type { CellObject } from "xlsx";
import * as React from "react";
import { toTable } from "@/app/lib/to-table";
import { JsonTable } from "@/components/json-table";
import { cn } from "@asterix/ui";
import { Badge } from "@asterix/ui/badge";
import { Button } from "@asterix/ui/button";
import autoAnimate from "@formkit/auto-animate";
import { UploadIcon } from "@radix-ui/react-icons";
import { read, utils } from "xlsx";

interface ExcelExtractorContext {
  file: [File, ArrayBuffer] | null;
  setFile: React.Dispatch<React.SetStateAction<[File, ArrayBuffer] | null>>;
}

const ExcelExtractorContext = React.createContext<ExcelExtractorContext>(
  {} as ExcelExtractorContext,
);

export function ExcelExtractorUpload() {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const { file, setFile } = React.useContext(ExcelExtractorContext);

  const handleClick = () => {
    if (hiddenFileInput.current instanceof HTMLInputElement) {
      hiddenFileInput.current.click();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return;
    const buffer = await file.arrayBuffer();
    setFile([file, buffer]);
  };

  return (
    <div
      className={cn("flex h-12 items-center justify-between p-2", {
        "border-b": file !== null,
      })}
    >
      <span className="truncate pr-4 text-muted-foreground">
        {file === null ? "No file selected" : file[0].name}
      </span>
      <div>
        <Button onClick={handleClick} variant="secondary" size="icon">
          <UploadIcon />
        </Button>
        <input
          type="file"
          onChange={handleChange}
          ref={hiddenFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
}

interface MyCellType {
  r: number;
  c: number;
  v: string;
}

function islandCells(cells: MyCellType[]) {
  const islands: MyCellType[][] = [];

  const visited = new Set<string>();

  for (const cell of cells) {
    if (visited.has(`${cell.r},${cell.c}`)) continue;

    const island: MyCellType[] = [];

    const stack: MyCellType[] = [cell];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(`${current.r},${current.c}`)) continue;

      visited.add(`${current.r},${current.c}`);

      island.push(current);

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const neighbor of neighbors) {
        if (visited.has(`${neighbor.r},${neighbor.c}`)) continue;

        const found = cells.find(
          (cell) => cell.r === neighbor.r && cell.c === neighbor.c,
        );

        if (found) {
          stack.push(found);
        }
      }
    }

    islands.push(island);
  }

  return islands;
}

function makeItRaws(islands: MyCellType[][]) {
  const raws: string[][][] = [];

  for (const island of islands) {
    const raw: string[][] = [];

    for (const cell of island) {
      if (!raw[cell.r]) raw[cell.r] = [];
      raw[cell.r][cell.c] = cell.v;
    }

    raws.push(raw.filter((row) => row !== undefined));
  }

  return raws;
}

function useWorkbook(file: [File, ArrayBuffer] | null) {
  const [sheets, setSheets] = React.useState<
    { name: string; tables: Data[][] }[]
  >([]);

  React.useEffect(() => {
    if (file === null) return;

    const workbook = read(file[1], { cellStyles: true });

    const sheets: { name: string; tables: Data[][] }[] = [];

    workbook.SheetNames.forEach((name) => {
      const sheet = workbook.Sheets[name];

      const range = utils.decode_range(sheet["!ref"]!);

      const cells: MyCellType[] = [];

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = utils.encode_cell(cellAddress);
          const cell = sheet[cellRef] as CellObject;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (!cell?.s?.bgColor?.rgb) continue;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (cell.s.bgColor.rgb !== "808080") continue;

          cells.push({ r: R, c: C, v: `${cell.v?.toString()}` });
        }
      }

      const islands = islandCells(cells);
      const raws = makeItRaws(islands);

      const tables: Data[][] = raws.map((raw) => {
        return toTable(raw);
      });

      sheets.push({ name, tables });
    });

    setSheets(sheets);
  }, [file]);

  return { sheets };
}

export function ExcelExtractorView() {
  const { file } = React.useContext(ExcelExtractorContext);
  const { sheets } = useWorkbook(file);

  const [active, setActive] = React.useState<number>(0);

  if (!sheets || sheets.length == 0) return null;

  return (
    <div className="flex h-[42rem]">
      <div className="w-[300px] divide-y border-r">
        {sheets.map((sheet, i) => (
          <button
            key={i}
            className={cn(
              "flex w-full justify-between p-4 text-sm transition hover:bg-accent",
              {
                "bg-muted": i === active,
              },
            )}
            onClick={() => setActive(i)}
          >
            <span>{sheet.name}</span>
            <Badge>{sheet.tables.length}</Badge>
          </button>
        ))}
      </div>
      <div className="space-y-4 overflow-auto p-4">
        {sheets[active].tables.map((data, i) => {
          return <JsonTable key={i} data={data} />;
        })}
      </div>
    </div>
  );
}

export function ExcelExtractor() {
  const parent = React.useRef<HTMLDivElement>(null);

  const [file, setFile] = React.useState<[File, ArrayBuffer] | null>(null);

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <ExcelExtractorContext.Provider value={{ file, setFile }}>
      <div ref={parent} className="overflow-hidden rounded-lg border bg-card">
        <ExcelExtractorUpload />
        <ExcelExtractorView />
      </div>
    </ExcelExtractorContext.Provider>
  );
}
