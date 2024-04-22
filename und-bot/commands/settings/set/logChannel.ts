import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "log-channel";

export const description =
  "Set the channel for sending logs of the server from the bot" as const;

export const options = [
  {
    name: "channel",
    description: "The channel to use for sending logs",
    type: ApplicationCommandOptionType.Channel,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [channel] = helper.getOptions(options);
  await GuildCache.get().setLogChannel(channel.id);
  await helper.finish(`Log Channel: ${channel}`);
};

export const middlewares = [onlyOwnerMiddleware];
