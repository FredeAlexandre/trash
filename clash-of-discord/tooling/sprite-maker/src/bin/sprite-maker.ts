#!/usr/bin/env node
import { Command } from "commander";

import { gen } from "./commands/gen";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

function main() {
  const program = new Command()
    .name("sprite-maker")
    .description(
      "a suit of tools to create sprite sheets from a set of images.",
    )
    .version("0.1.0", "-v, --version", "display the version number");

  program.addCommand(gen);

  program.parse();
}

main();
