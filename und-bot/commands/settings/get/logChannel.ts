import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "log-channel";

export const description =
  "Show the channel for sending logs of the server from the bot" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const logChannel = await GuildCache.get().getLogChannel();
  await helper.finish(`Log Channel: <#${logChannel}>`);
};

export const middlewares = [onlyOwnerMiddleware];
