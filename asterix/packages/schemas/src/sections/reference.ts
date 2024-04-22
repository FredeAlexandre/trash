import { z } from "zod";

import { createSection } from "../utils/create-section";

export const SectionReferenceSchema = createSection("reference", {
  title: z.string(),
  acronym: z.string(),
  reference: z.string().url(),
});

export type SectionReference = z.infer<typeof SectionReferenceSchema>;
