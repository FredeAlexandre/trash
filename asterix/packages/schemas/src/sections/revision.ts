import { z } from "zod";

import { createSection } from "../utils/create-section";

export const SectionRevisionSchema = createSection("revision", {
  version: z.string(),
  date: z.string().datetime(),
  owner: z.string(),
  description: z.string(),
});

export type SectionRevision = z.infer<typeof SectionRevisionSchema>;
