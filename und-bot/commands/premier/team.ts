import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import HenrikCache from "../../models/HenrikCache";
import { DiscordInteractionHelper } from "../../utils";

import { waitWithTimeout } from "../../utils";

export const name = "team";

export const description = "Show a nice embed card about `team`" as const;

export const options = [
  {
    name: "name",
    description: "Team name",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "tag",
    description: "Team tag",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "update",
    description: "Force to update the data on the server",
    type: ApplicationCommandOptionType.Boolean,
    required: false,
  },
  {
    name: "expand-players",
    description: "Show the cards of the players of the team",
    type: ApplicationCommandOptionType.Boolean,
    required: false,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [name, tag, update, expandPlayers] = helper.getOptions(options);

  const team = HenrikCache.getTeam(name, tag);

  let embeds: EmbedBuilder[] = [];

  try {
    await waitWithTimeout(
      team.get({
        update: update ?? false,
      }),
      3000,
      async () => {
        await helper.send("The server is fetching the data, please wait...");
      }
    );

    const embed = team.embed();
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

  if (expandPlayers && team.data) {
    const result = await Promise.all(
      team.data.member.map(async (member) => {
        const player = HenrikCache.getPlayer(member.name, member.tag);
        await player.get();
        return player;
      })
    );
    embeds = embeds.concat(
      // @ts-ignore
      result.filter((p) => !!p.embed()).map((p) => p.embed())
    );
  }

  await helper.finish({ embeds });
};
