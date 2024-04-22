import { z } from "zod";

export const NativeType = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export type NativeType = z.infer<typeof NativeType>;
