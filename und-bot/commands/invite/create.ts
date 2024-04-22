import { ApplicationCommandOptionType } from "discord.js";

import UserCache from "../../models/UsersCache";
import InvitesCache from "../../models/InvitesCache";
import { DiscordInteractionHelper, getTextChannels } from "../../utils";

export const name = "create";

export const description =
  "Create a link invitation of `amount` max use(s)" as const;

export const options = [
  {
    name: "amount",
    description: "The amount of max use(s) of the invitation",
    type: ApplicationCommandOptionType.Integer,
    required: true,
    min_value: 1,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [amount] = helper.getOptions(options);
  const userModel = UserCache.get(helper.user.id);
  const balance = await userModel.getInviteBalance();
  helper.addField("Balance", `${balance}`, true);
  if (amount > balance) {
    return await helper
      .toggleError("`amount` is greater than user balance")
      .finish(`Sorry you can't create more than ${balance} invitation(s)`);
  }
  const channel = getTextChannels().at(0);
  if (!channel) {
    return await helper
      .toggleError("No channel found to create invite")
      .finish(`No text channels found contact admin`);
  }
  const invite = await channel.createInvite({
    maxUses: amount,
    maxAge: 0,
    temporary: false,
  });
  let remaining: number;
  try {
    if (amount == 1) {
      await InvitesCache.addLastUses(invite.code);
    }
    [remaining] = await Promise.all([
      await userModel.removeInviteBalance(amount),
      await userModel.addInviteCode(invite.code),
      await InvitesCache.get(invite.code).setCreator(helper.user.id),
    ]);
  } catch (error) {
    await invite.delete();
    return await helper
      .toggleError("Database write/read failed")
      .finish(
        `Our database failed to update your balance ! Please contact admin`
      );
  }
  await helper
    .addField("Remaining", `${remaining}`, true)
    .addField("Link", `${invite.url}`, true)
    .addField("Code", `${invite.code}`, true)
    .finish(
      `Your invitation link was created !\n\nLink: ${invite.url}\nCode: ${invite.code}\n\nYou have ${remaining} invites left !`
    );
};
