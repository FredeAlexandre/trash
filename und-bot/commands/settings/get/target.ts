import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { onlyAdminMiddleware } from "../../../utils/index";

export const name = "target";

export const description = "Show the target" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  await helper.finish(
    `Target is: <@${await GuildCache.get().getHelloTarget()}>`
  );
};

export const middlewares = [onlyAdminMiddleware];
