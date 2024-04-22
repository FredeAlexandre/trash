import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import HenrikCache from "../../models/HenrikCache";
import { DiscordInteractionHelper } from "../../utils";

import { waitWithTimeout, getSeasonEmbed } from "../../utils";

export const name = "seasons";

export const description = "Show all the seasons of premier" as const;

export const options = [
  {
    name: "update",
    description: "Update the data on cache",
    type: ApplicationCommandOptionType.Boolean,
    required: false,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [update] = helper.getOptions(options);

  let embeds: EmbedBuilder[] = [];

  try {
    const result = await waitWithTimeout(
      HenrikCache.getSeasons({
        update: update ?? false,
      }),
      3000,
      async () => {
        await helper.send("The server is fetching the data, please wait...");
      }
    );

    if (!result) {
      return await helper
        .toggleError("Result is undefined")
        .finish("Error while fetching data please try again later");
    }

    embeds.push(...result.map((s, i) => getSeasonEmbed(i + 1, s)));
  } catch (error) {
    if (typeof error == "object" && error != null && "message" in error) {
      await helper
        .toggleError(error.message as string)
        .finish("Error while fetching data please try again later");
    } else {
      await helper
        .toggleError("Error while fetching data, no message found")
        .finish("Error while fetching data please try again later");
    }
  }

  await helper.finish({ embeds });
};
