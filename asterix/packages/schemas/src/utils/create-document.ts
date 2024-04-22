import { z } from "zod";

import { isSection, ZodSection } from "./create-section";

export type ZodDocument<
  TType extends string = string,
  TSections extends { [key: string]: ZodSection } = {
    [key: string]: ZodSection;
  },
> = z.ZodObject<{
  type: z.ZodLiteral<TType>;
  sections: z.ZodObject<TSections>;
}>;

export function createDocument<
  TType extends string,
  TSections extends {
    [key: string]: ZodSection;
  },
>(type: TType, sections: TSections): ZodDocument<TType, TSections> {
  return z.object({
    type: z.literal(type),
    sections: z.object(sections),
  });
}

export function isDocument(schema: unknown): schema is ZodDocument {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as unknown;
    if (
      typeof shape === "object" &&
      shape !== null &&
      "type" in shape &&
      shape.type instanceof z.ZodLiteral &&
      typeof shape.type.value === "string" &&
      "sections" in shape &&
      shape.sections instanceof z.ZodObject
    ) {
      const sectionsShape = shape.sections.shape as unknown;
      if (typeof sectionsShape === "object" && sectionsShape !== null) {
        for (const key in sectionsShape) {
          // @ts-ignore
          if (!isSection(sectionsShape[key] as unknown)) return false;
        }
        return true;
      }
    }
  }
  return false;
}
