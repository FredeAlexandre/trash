import discord from "../services/discord";

import InvitesCache from "../models/InvitesCache";
import UsersCache from "../models/UsersCache";
import { DiscordLogBuilder } from "../utils";
import logger from "../services/logger";

discord.on("guildMemberAdd", async (member) => {
  try {
    const invites = await member.guild.invites.fetch();

    const lasts = await InvitesCache.getLastUses();

    const deleted = lasts.filter((id) => !invites.find((i) => i.code == id));

    const dlogger = new DiscordLogBuilder()
      .setTitle("@guildMemberAdd - Invites")
      .setAuthor(member.user.username, member.user.displayAvatarURL())
      .addField("Member", member.user.toString(), true);

    if (deleted.length > 0) {
      const inviteId = deleted[0];
      const inviteModel = InvitesCache.get(inviteId);
      const cachedUses = await inviteModel.getUses();
      const creator = await inviteModel.getCreator();
      dlogger
        .addField("Invite code", `${inviteId}`)
        .addField("Creator", `<@${creator}>` || "No creator", true)
        .addField(
          "Uses",
          `${cachedUses} -> ${cachedUses + 1}/${cachedUses + 1}`,
          true
        );
      if (creator) {
        const children = await UsersCache.get(creator).addInviteChildren(
          member.user.id
        );
        await UsersCache.get(member.user.id).setInviteParent(creator);
        dlogger.addField(
          "Children",
          children.length == 0
            ? "No one"
            : children.map((c) => `<@${c}>`).join(", ")
        );
        await dlogger.isSuccess().sendReport();
      } else {
        await dlogger.isFailure("No creator was found").sendReport();
      }
      await InvitesCache.removeLastUses(inviteId);
      return;
    }

    for (let i = 0; i < invites.size; i++) {
      const invite = invites.at(i);
      if (!invite) continue;
      const uses = invite.uses || 0;
      const inviteModel = InvitesCache.get(invite.code);
      const cachedUses = await inviteModel.getUses();

      if (uses > cachedUses) {
        const creator = await inviteModel.getCreator();
        dlogger
          .addField("Invite code", `${invite.code}`)
          .addField("Creator", `<@${creator}>` || "No creator", true)
          .addField("Uses", `${cachedUses} -> ${uses}/${invite.maxUses}`, true);
        if (invite.maxUses && uses + 1 >= invite.maxUses) {
          await InvitesCache.addLastUses(invite.code);
        }
        await inviteModel.setUses(uses);
        if (creator) {
          const children = await UsersCache.get(creator).addInviteChildren(
            member.user.id
          );
          await UsersCache.get(member.user.id).setInviteParent(creator);
          dlogger.addField(
            "Children",
            children.length == 0
              ? "No one"
              : children.map((c) => `<@${c}>`).join(", ")
          );
          await dlogger.isSuccess().sendReport();
        } else {
          await dlogger.isFailure("No creator was found").sendReport();
        }
        return;
      }
    }

    await dlogger.isFailure("No invite found").sendReport();
  } catch (error) {
    logger.error("@guildMemberAdd", error, member);
  }
});
