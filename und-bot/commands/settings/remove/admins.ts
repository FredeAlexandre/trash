import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admins";

export const description = "Remove a user as admin of the server" as const;

export const options = [
  {
    name: "admin",
    description: "The users to remove as admin",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [user] = helper.getOptions(options);
  const result = await GuildCache.get().removeAdmin(user.id);
  await helper.finish(`Admins: ${result.map((u) => `<@${u}>`).join(", ")}`);
};

export const middlewares = [onlyOwnerMiddleware];
