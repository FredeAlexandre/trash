import { z } from "zod";

import { SectionContributionSchema } from "../sections/contribution";
import { SectionMetadataSchema } from "../sections/metadata";
import { SectionReferenceSchema } from "../sections/reference";
import { SectionRevisionSchema } from "../sections/revision";
import { createSection } from "../utils/create-section";

export const SectionRevisionCCDSchema = SectionRevisionSchema.extend({
  subtype: z.literal("ccd"),
  data: z.array(
    SectionRevisionSchema.shape.data.element.extend({
      pcr: z.string(),
    }),
  ),
});

export type SectionRevisionCCD = z.infer<typeof SectionRevisionCCDSchema>;

export const SectionRequirementsCCDSchema = createSection("ccd-requirements", {
  no: z.string(),
  title: z.string(),
  version: z.number(),
});

export type SectionRequirementsCCD = z.infer<
  typeof SectionRequirementsCCDSchema
>;

export const SectionRessourceUsage = createSection("ccd-ressource-usage", {});

export const DocumentCCDSchema = z.object({
  type: z.literal("ccd"),
  sections: z.object({
    metadata: SectionMetadataSchema,
    contributions: SectionContributionSchema,
    revision: SectionRevisionCCDSchema,
    reference: SectionReferenceSchema,
    requirements: SectionRequirementsCCDSchema,
  }),
});

export type DocumentCCD = z.infer<typeof DocumentCCDSchema>;
