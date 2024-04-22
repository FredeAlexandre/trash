import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admins";

export const description = "Show the admins of the server" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const admins = await GuildCache.get().getAdmins();
  const users = admins.map((a) => `<@${a}>`).join(", ");
  await helper.finish(`Admins: ${users}`);
};

export const middlewares = [onlyOwnerMiddleware];
