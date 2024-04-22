import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import HenrikCache from "../../models/HenrikCache";
import { DiscordInteractionHelper, PremierSeason } from "../../utils";

import { waitWithTimeout, getMatchEmbed } from "../../utils";
import { finished } from "stream";

export const name = "macthes";

export const description = "Show matches of given season or last" as const;

export const options = [
  {
    name: "season",
    description: "The season number to show the matches",
    type: ApplicationCommandOptionType.Integer,
    required: false,
    min_value: 1,
  },
  {
    name: "update",
    description: "Update the data on cache",
    type: ApplicationCommandOptionType.Boolean,
    required: false,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [seasonInputed, update] = helper.getOptions(options);

  const seasonNb = seasonInputed ?? 0;

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

    if (!result || result.length == 0) {
      return await helper
        .toggleError("Result is undefined")
        .finish("Error while fetching data please try again later");
    }

    let season: PremierSeason;
    if (seasonNb == 0) {
      season = result[result.length - 1];
    } else {
      if (seasonNb > result.length) {
        return await helper
          .toggleError("Season not found")
          .finish("Error while fetching data please try again later");
      } else {
        season = result[seasonNb - 1];
      }
    }

    if (season.events.length == 0) {
      return await helper.finish("No matches planned for now");
    } else {
      embeds.push(...season.events.map((s, i) => getMatchEmbed(i + 1, s)));
    }
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

  let pack: EmbedBuilder[] = [];
  let last_index = 0;

  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i];
    if (pack.length == 10) {
      await helper.send({ embeds: pack });
      pack = [];
    }
    pack.push(embed);
    last_index = i;
  }

  pack = embeds.splice(last_index, embeds.length - 1);
  if (pack.length == 0) return await helper.report();
  await helper.finish({ embeds: pack });
};
