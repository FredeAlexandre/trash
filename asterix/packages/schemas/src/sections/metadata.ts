import { z } from "zod";

import { NativeType } from "../common";
import { createSection } from "../utils/create-section";

export const SectionMetadataSchema = createSection("metadata", {
  key: z.string(),
  value: NativeType,
});

export type SectionMetadata = z.infer<typeof SectionMetadataSchema>;
