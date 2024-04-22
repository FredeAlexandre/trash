import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import HenrikCache from "../../models/HenrikCache";

import { DiscordInteractionHelper, wait, waitWithTimeout } from "../../utils";

export const name = "player";

export const description =
  "Show you some information about a player in valorant" as const;

export const options = [
  {
    name: "name",
    description: "The name of the player",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "tag",
    description: "The tag of the player",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "update",
    description: "Update the player info from the cache of the server",
    type: ApplicationCommandOptionType.Boolean,
    required: false,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [name, tag, update] = helper.getOptions(options);

  const player = HenrikCache.getPlayer(name, tag);

  let embeds: EmbedBuilder[] = [];

  try {
    await waitWithTimeout(
      player.get({
        update: update ?? false,
      }),
      3000,
      async () => {
        await helper.send(
          "The server is fetching the data, please wait...",
          true
        );
      }
    );

    const embed = player.embed();
    if (!embed) throw new Error("No embed found");
    embeds.push(embed);
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
