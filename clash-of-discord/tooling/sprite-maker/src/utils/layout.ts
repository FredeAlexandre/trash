import type { Sharp } from "sharp";

import { concat } from "./concat";

export async function layout(opts: (Sharp | Sharp[])[]) {
  const images = await Promise.all(
    opts.map((opt) => {
      if (Array.isArray(opt)) {
        return concat("horizontal", ...opt);
      }

      return opt;
    }),
  );

  return concat("vertical", ...images);
}
