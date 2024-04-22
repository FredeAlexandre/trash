import discord from "../services/discord";

import GuildCache from "../models/GuildCache";

discord.on("roleDelete", async (role) => {
  try {
    await GuildCache.get().remove(role);
  } catch (error) {
    console.error("@roleDelete", error, role);
  }
});
