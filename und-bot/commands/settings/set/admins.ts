import { DiscordInteractionHelper } from "../../../utils";

import GuildCache from "../../../models/GuildCache";
import { ApplicationCommandOptionType } from "discord.js";
import { onlyOwnerMiddleware } from "../../../utils/index";

export const name = "admins";

export const description = "Set the admins of the server" as const;

export const options = [
  {
    name: "admins",
    description: "The users id to set as admin",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [adminsRaw] = helper.getOptions(options);
  const admins = adminsRaw.split(",").map((r) => r.trim());
  const result = await GuildCache.get().setAdmins(admins);
  await helper.finish(`Admins: ${result.map((u) => `<@${u}>`).join(", ")}`);
};

export const middlewares = [onlyOwnerMiddleware];
