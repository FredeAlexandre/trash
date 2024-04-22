import { z } from "zod";

import { SectionContributionSchema } from "../sections/contribution";
import { SectionMetadataSchema } from "../sections/metadata";
import { SectionRevisionSchema } from "../sections/revision";
import { createSection } from "../utils";

const SectionCidDataSchema = createSection("cid-data", {
  tile: z.string(),
  metadata: z.record(z.string()),
  references: z.array(
    z.object({
      provider: z.string(),
      id: z.string(),
    }),
  ),
});

export const DocumentCIDSchema = z.object({
  type: z.literal("cid"),
  sections: z.object({
    metadata: SectionMetadataSchema,
    contributions: SectionContributionSchema,
    revision: SectionRevisionSchema,
    data: SectionCidDataSchema,
  }),
});

export type DocumentCID = z.infer<typeof DocumentCIDSchema>;
