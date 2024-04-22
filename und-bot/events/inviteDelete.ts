import discord from "../services/discord";

import InvitesCache from "../models/InvitesCache";
import UsersCache from "../models/UsersCache";
import logger from "../services/logger";
import { DiscordLogBuilder } from "../utils";

discord.on("inviteDelete", async (invite) => {
  try {
    const inviteModel = InvitesCache.get(invite.code);
    const creator = await inviteModel.getCreator();
    if (!creator) {
      logger.warn(`Invite ${invite.code} has no creator`);
      return;
    }
    await new DiscordLogBuilder()
      .setTitle("@inviteDelete - Invites")
      .addField("Invite", invite.code, true)
      .addField("Creator", creator || "", true)
      .sendReport();
    await UsersCache.get(creator).removeInviteCode(invite.code);
  } catch (error) {
    logger.error("@inviteDelete", error, invite);
  }
});
