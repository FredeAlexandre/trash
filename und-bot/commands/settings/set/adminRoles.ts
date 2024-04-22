import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admin-roles";

export const description = "Set the roles for admins of the server" as const;

export const options = [
  {
    name: "roles",
    description: "The roles id to set as admin roles",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [rolesRaw] = helper.getOptions(options);
  const roles = rolesRaw.split(",").map((r) => r.trim());
  const result = await GuildCache.get().setAdminsRoles(roles);
  await helper.finish(`Roles: ${result.map((r) => `<@&${r}>`).join(", ")}`);
};

export const middlewares = [onlyOwnerMiddleware];
