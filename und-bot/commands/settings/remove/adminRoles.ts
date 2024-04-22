import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admin-roles";

export const description = "Remove an admin role on the server" as const;

export const options = [
  {
    name: "role",
    description: "The roles to remove",
    type: ApplicationCommandOptionType.Role,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [role] = helper.getOptions(options);
  if (!("members" in role))
    return helper.toggleError("Invalid role set").finish(`Invalid role set`);
  const [result] = await GuildCache.get().remove(role);
  await helper.finish(`Roles: ${result.map((r) => `<@&${r}>`).join(", ")}`);
};

export const middlewares = [onlyOwnerMiddleware];
