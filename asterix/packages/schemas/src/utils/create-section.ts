import { z } from "zod";

export type ZodSection<
  TType extends string = string,
  TData extends z.ZodRawShape = z.ZodRawShape,
> = z.ZodObject<{
  type: z.ZodLiteral<TType>;
  data: z.ZodArray<z.ZodObject<TData>>;
}>;

export function createSection<
  TType extends string,
  TData extends z.ZodRawShape,
>(type: TType, data: TData): ZodSection<TType, TData> {
  return z.object({
    type: z.literal(type),
    data: z.array(z.object(data)),
  });
}

export function isSection(schema: unknown): schema is ZodSection {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as unknown;
    if (
      typeof shape === "object" &&
      shape !== null &&
      "type" in shape &&
      shape.type instanceof z.ZodLiteral &&
      typeof shape.type.value === "string" &&
      "data" in shape &&
      shape.data instanceof z.ZodArray &&
      shape.data.element instanceof z.ZodObject
    ) {
      return true;
    }
  }
  return false;
}
