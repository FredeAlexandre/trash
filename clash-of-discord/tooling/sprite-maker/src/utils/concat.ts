import type { Sharp } from "sharp";
import sharp from "sharp";

export type ConcatOrientation = "horizontal" | "vertical";

export async function concat(
  orientation: ConcatOrientation,
  ...images: Sharp[]
) {
  const metadatas = await Promise.all(
    images.map(async (image) => ({
      image,
      metadata: await image.metadata(),
      buffer: await image.toBuffer(),
    })),
  );

  if (orientation === "horizontal") {
    const width = metadatas.reduce(
      (acc, { metadata }) => acc + (metadata.width ?? 0),
      0,
    );
    const height = Math.max(
      ...metadatas.map(({ metadata }) => metadata.height ?? 0),
    );

    let left = 0;

    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(
        metadatas.map((image) => {
          const { metadata, buffer } = image;
          const result = {
            input: buffer,
            top: 0,
            left,
          };
          left += metadata.width ?? 0;
          return { ...result };
        }),
      )
      .toFormat("png");
  } else {
    const width = Math.max(
      ...metadatas.map(({ metadata }) => metadata.width ?? 0),
    );

    const height = metadatas.reduce(
      (acc, { metadata }) => acc + (metadata.height ?? 0),
      0,
    );

    let top = 0;

    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(
        metadatas.map((image) => {
          const { metadata, buffer } = image;
          const result = {
            input: buffer,
            top,
            left: 0,
          };
          top += metadata.height ?? 0;
          return { ...result };
        }),
      )
      .toFormat("png");
  }
}
