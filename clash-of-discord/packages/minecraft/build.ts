import { existsSync, promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
import sharp from "sharp";
import { z } from "zod";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function gen({
  directory,
  output,
}: {
  directory: string;
  output: string;
}) {
  const files = await fs.readdir(directory);

  const images = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
  });

  if (images.length === 0) {
    logger().warn(`No images found in ${directory}. Skipping.`);
    return;
  }

  const name = path.basename(directory);
  const output_file = path.resolve(output, `${name}.png`);

  logger().info(`Generating sprite sheet for ${name}`);

  const readed_images = await Promise.all(
    images.map(async (image) => {
      logger().info(`Reading image ${image}`);
      const buffer = await fs.readFile(path.resolve(directory, image));
      const { width, height } = await sharp(buffer).metadata();
      return { buffer, width: width || 0, height: height || 0 };
    }),
  );

  let result_height = 0;
  let result_width = 0;

  for (const { width, height } of readed_images) {
    result_height += height;
    result_width = Math.max(result_width, width);
  }

  logger().info(
    `Creating sprite sheet with dimensions ${result_width}x${result_height}`,
  );

  let top = 0;

  const buffer = await sharp({
    create: {
      width: result_width,
      height: result_height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(
      readed_images.map(({ buffer, height }) => {
        top += height;

        return {
          input: buffer,
          top: top - height,
          left: 0,
        };
      }),
    )
    .png()
    .toBuffer();

  return {
    buffer,
    output: output_file,
  };
}

const generateOptionsSchema = z.object({
  cwd: z.string(),
  output: z.string(),
  directories: z.array(z.string()),
});

const generate = new Command()
  .name("generate")
  .description("generate all the sprites sheets from directories of images")
  .argument(
    "[directories...]",
    "the directories to generate the sprite sheet from",
  )
  .option(
    "-o, --output <output>",
    "the output directory to save the sprite sheets",
    "dist",
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .action(async (directories, opts) => {
    try {
      const options = generateOptionsSchema.parse({ directories, ...opts });

      if (options.directories.length === 0) {
        throw new Error("No directories provided");
      }

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger().error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const results = await Promise.all(
        options.directories.map(async (dir) => {
          const directory = path.resolve(cwd, dir);

          if (!existsSync(directory)) {
            logger().error(
              `The directory ${directory} does not exist. Skipping.`,
            );
            return;
          }

          const result = await gen({
            directory,
            output: path.resolve(cwd, options.output),
          });

          if (!result) {
            return;
          }

          return result;
        }),
      );

      logger().info("Creating output directory at " + options.output);
      await fs.mkdir(options.output, { recursive: true });

      for (const result of results) {
        if (!result) {
          continue;
        }

        await fs.writeFile(result.output, result.buffer);
        logger().success(`Generated sprite sheet at ${result.output}`);
      }
    } catch (error) {
      handleError(error);
    }
  });

async function main() {
  const program = new Command()
    .name("sheet-maker")
    .description("create sprite sheets from directoris of images")
    .version("1.0.0", "-v, --version", "display the version number");

  program.addCommand(generate);

  program.parse();
}

main();

function logger() {
  return {
    error(...args: unknown[]) {
      console.log(chalk.red(...args));
    },
    warn(...args: unknown[]) {
      console.log(chalk.yellow(...args));
    },
    info(...args: unknown[]) {
      console.log(chalk.cyan(...args));
    },
    success(...args: unknown[]) {
      console.log(chalk.green(...args));
    },
    break() {
      console.log("");
    },
  };
}

function handleError(error: unknown) {
  if (typeof error === "string") {
    logger().error(error);
    process.exit(1);
  }

  if (error instanceof Error) {
    logger().error(error.message);
    process.exit(1);
  }

  logger().error("Something went wrong. Please try again.");
  process.exit(1);
}
