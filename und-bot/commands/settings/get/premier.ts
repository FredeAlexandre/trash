import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { onlyAdminMiddleware } from "../../../utils/index";

export const name = "premier";

export const description =
  "Show the channel for sending premier matches from the bot" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [premierChannel, regular, substitute] = await Promise.all([
    GuildCache.get().getPremierChannel(),
    GuildCache.get().getPremierRegularRole(),
    GuildCache.get().getPremierSubstituteRole(),
  ]);
  await helper.finish(
    `Premier Channel: ${premierChannel}\nRegular Role: ${regular}\nSubstitute Role: ${substitute}`
  );
};

export const middlewares = [onlyAdminMiddleware];
