import { existsSync } from "fs";
import path from "node:path";
import { Command } from "commander";
import { z } from "zod";

import { handleError } from "../utils/handle-error";

const genOptionsSchema = z.object({
  cwd: z.string(),
  direcories: z.array(z.string()),
  output: z.string(),
});

export const gen = new Command()
  .name("gen")
  .description("generate the sprite sheets fropm specific directories.")
  .argument("<direcories...>", "the directories to analyse")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .option("-o, --output <output>", "the output directory.", "out")
  .action((direcories: unknown, opts) => {
    try {
      const options = genOptionsSchema.parse({
        direcories,
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      options.direcories = options.direcories
        .map((dir) => path.resolve(cwd, dir))
        .filter((dir) => {
          if (!existsSync(dir)) {
            handleError(`The directory "${dir}" does not exist. Ignoring it.`);
            return false;
          } else {
            return true;
          }
        });
    } catch (error) {
      handleError(error);
    }
  });
