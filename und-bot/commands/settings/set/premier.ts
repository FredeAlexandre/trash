import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import premier from "../../../services/premier";
import { onlyAdminMiddleware } from "../../../utils/index";

export const name = "premier";

export const description =
  "Set the channel for sending next week matches of underscore" as const;

export const options = [
  {
    name: "channel",
    description: "The channel to use for sending matches",
    type: ApplicationCommandOptionType.Channel,
    required: true,
  },
  {
    name: "regular",
    description: "The regular role",
    type: ApplicationCommandOptionType.Role,
    required: true,
  },
  {
    name: "substitute",
    description: "The substitute role",
    type: ApplicationCommandOptionType.Role,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [channel, regular, substitute] = helper.getOptions(options);
  await GuildCache.get().setPremierChannel(channel.id);
  await GuildCache.get().setPremierRegularRole(regular.id);
  await GuildCache.get().setPremierSubstituteRole(substitute.id);
  try {
    await premier.start();
  } catch (error) {
    return await helper
      .toggleError("Bot start error with message: " + error)
      .finish("The premier failed to launch");
  }
  await helper.finish(
    `Premier Channel: ${channel}\nRegular Role: ${regular}\nSubstitute Role: ${substitute}`
  );
};

export const middlewares = [onlyAdminMiddleware];
