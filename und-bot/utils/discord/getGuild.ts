import discord from "../../services/discord";

import { GUILD_ID } from "../../services/env";

function getGuild(guildId?: string) {
  const guild = discord.guilds.cache.get(guildId ?? GUILD_ID);
  if (!guild) throw new Error("Guild not found");
  return guild;
}

export default getGuild;
