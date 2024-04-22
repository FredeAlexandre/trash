import discord from "../services/discord";

import GuildCache from "../models/GuildCache";
import logger from "../services/logger";

discord.on("guildMemberUpdate", async (oldMember, newMember) => {
  try {
    const adminRoles = await GuildCache.get().getAdminsRoles();

    const newRoles = newMember.roles.cache;

    const hasAdminRole = newRoles.some((role) => adminRoles.includes(role.id));

    const admins = await GuildCache.get().getAdmins();

    if (admins.includes(newMember.id) && !hasAdminRole) {
      await GuildCache.get().removeAdmin(newMember.user.id);
    }

    if (!admins.includes(newMember.id) && hasAdminRole) {
      await GuildCache.get().addAdmin(newMember.user.id);
    }
  } catch (error) {
    logger.error("@guildMemberUpdate", error, oldMember, newMember);
  }
});
