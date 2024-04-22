import discord from "../services/discord";

import { getGuild } from "../utils";

import InvitesCache from "../models/InvitesCache";

discord.on("ready", async () => {
  try {
    const invites = await getGuild().invites.fetch();

    invites.forEach(async (invite) => {
      const inviteModel = InvitesCache.get(invite.code);
      if (invite.uses) {
        await inviteModel.setUses(invite.uses);
      }
    });
  } catch (error) {
    console.error("@ready", error);
  }
});
