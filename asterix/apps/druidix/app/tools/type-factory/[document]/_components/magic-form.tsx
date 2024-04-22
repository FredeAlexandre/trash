import type { ZodDocument } from "@asterix/schemas";
import type { z } from "zod";
import * as React from "react";
import { isDocument } from "@asterix/schemas";

import { SectionForm } from "./section-form";

export function DocumentForm({ schema }: { schema: ZodDocument }) {
  const title = schema.shape.type.value;
  const sections = schema.shape.sections.shape;

  return (
    <div className="w-full max-w-[50rem]">
      <h1 className="text-4xl">{title}</h1>
      <div className="mt-8 space-y-6">
        {Object.entries(sections).map(([key, value]) => {
          return (
            <SectionForm
              key={key}
              document={title}
              section={value.shape.type.value}
            />
          );
        })}
      </div>
    </div>
  );
}

export function MagicForm({ schema }: { schema: z.ZodTypeAny }) {
  if (isDocument(schema)) return <DocumentForm schema={schema} />;
  return <>Can&apos;t render this schema</>;
}
