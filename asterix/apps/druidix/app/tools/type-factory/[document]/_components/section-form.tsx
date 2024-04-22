"use client";

import type { NativeType, ZodSection } from "@asterix/schemas";
import type { z } from "zod";
import * as React from "react";
import documents from "@asterix/schemas/list";
import { Button } from "@asterix/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@asterix/ui/table";
import { PlusIcon } from "@radix-ui/react-icons";

import { ZodInput } from "./zod-input";

export function generateEmptyValues(section: ZodSection) {
  if (section == undefined) return {};
  const keys = Object.keys(section.shape.data.element.shape);

  const result: Record<string, NativeType> = {};

  keys.forEach((key) => {
    result[key] = "";
  });

  return result;
}

export function SectionForm({
  section: _section,
  document: _document,
}: {
  document: string;
  section: string;
}) {
  const document = documents.find(
    (document) => document.shape.type.value === _document,
  );

  const schema = document?.shape.sections.shape[_section] as ZodSection;

  const [values, setValues] = React.useState<z.infer<typeof schema.shape.data>>(
    [generateEmptyValues(schema)],
  );

  if (!schema) return <></>;

  const title = schema.shape.type.value;

  const fields = Object.entries(schema.shape.data.element.shape);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-lg">{title}</h2>
        <Button variant="outline" size="sm">
          Import Table
        </Button>
      </div>
      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map(([key]) => {
                return <TableHead key={key}>{key}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((value, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {Object.entries(value).map(([key, value]) => {
                    const schema = fields.find(
                      ([fieldKey]) => fieldKey === key,
                    )?.[1];

                    if (!schema) return <>No Schema found</>;

                    return (
                      <TableCell key={key}>
                        <ZodInput
                          schema={schema}
                          // eslint-disable-next-line
                          value={value}
                          onChange={(e) => {
                            setValues([
                              ...values.map((v, i) => {
                                if (i === rowIndex) {
                                  return { ...v, [key]: e.target.value };
                                }
                                return v;
                              }),
                            ]);
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button
        className="mt-2 w-full"
        variant="outline"
        onClick={() => {
          setValues([...values, generateEmptyValues(schema)]);
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
