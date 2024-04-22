import { z } from "zod";

import { createSection } from "../utils/create-section";

export const SectionContributionSchema = createSection("contribution", {
  role: z.string(),
  name: z.string(),
  date: z.string().datetime(),
});

export type SectionContribution = z.infer<typeof SectionContributionSchema>;
