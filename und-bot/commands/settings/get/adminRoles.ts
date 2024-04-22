import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admin-roles";

export const description = "Show the roles for admins of the server" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const roles = await GuildCache.get().getAdminsRoles();
  await helper.finish(`Roles: ${roles.map((r) => `<@&${r}>`).join(", ")}`);
};

export const middlewares = [onlyOwnerMiddleware];
