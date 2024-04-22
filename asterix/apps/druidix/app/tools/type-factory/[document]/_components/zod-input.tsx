import * as React from "react";
import { Input } from "@asterix/ui/input";
import { z } from "zod";

export function ZodInput({
  schema,
  value,
  onChange,
}: {
  schema: z.ZodTypeAny;
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  if (schema instanceof z.ZodString) {
    return <Input type="text" value={value} onChange={onChange} />;
  }

  if (schema instanceof z.ZodUnion) {
    return <Input type="text" value={value} onChange={onChange} />;
  }

  if (schema instanceof z.ZodNumber) {
    return <Input type="number" value={value} onChange={onChange} />;
  }

  return <>Can&apos;t render this schema</>;
}
