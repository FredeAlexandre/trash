import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyAdminMiddleware } from "../../../utils/index";

export const name = "target";

export const description = "Set the target" as const;

export const options = [
  {
    name: "target",
    description: "The user who receive the messages",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [target] = helper.getOptions(options);
  await GuildCache.get().setHelloTarget(target.id);
  await helper.finish(
    `Target is: <@${await GuildCache.get().getHelloTarget()}>`
  );
};

export const middlewares = [onlyAdminMiddleware];
