import { ApplicationCommandOptionType } from "discord.js";

import UserCache from "../../models/UsersCache";
import { DiscordInteractionHelper } from "../../utils";

export const name = "add";

export const description =
  "Add `amount` invitation(s) to `user` balance" as const;

export const options = [
  {
    name: "user",
    description: "The recipient of the invitation(s)",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
  {
    name: "amount",
    description: "The amount of invitations to add",
    type: ApplicationCommandOptionType.Integer,
    required: true,
    min_value: 1,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [user, amount] = helper.getOptions(options);
  if (!(await helper.onlyAdmin())) return;
  const result = await UserCache.get(user.id).addInviteBalance(amount);
  await helper
    .addField("Balance", `${result}`, true)
    .finish(`${user} invitation balance was updated to ${result}`);
};
