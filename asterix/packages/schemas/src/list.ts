import { z } from "zod";

import { DocumentCCDSchema, DocumentCIDSchema } from "./documents";

export default [DocumentCCDSchema, DocumentCIDSchema] as z.ZodObject<{
  type: z.ZodLiteral<string>;
  sections: z.ZodObject<z.ZodRawShape>;
}>[];
