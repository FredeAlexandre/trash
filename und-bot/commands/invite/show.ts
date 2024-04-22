import { EmbedBuilder, User, ApplicationCommandOptionType } from "discord.js";

import UsersCache from "../../models/UsersCache";
import { DiscordInteractionHelper } from "../../utils";

export const name = "show";

export const description = "Show `user` invitation balance and infos" as const;

export const options = [
  {
    name: "user",
    description: "The user you want to see data",
    type: ApplicationCommandOptionType.User,
    required: false,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  let user: User;
  const isAdmin = await helper.isAdmin();
  const [userOption] = helper.getOptions(options);
  if (isAdmin) {
    user = userOption ?? helper.user;
  } else {
    user = helper.user;
  }
  const userModel = UsersCache.get(user.id);
  const [balance, parent, children, codes] = await Promise.all([
    await userModel.getInviteBalance(),
    await userModel.getInviteParent(),
    await userModel.getInviteChildren(),
    await userModel.getInviteCodes(),
  ]);

  const data = [
    { name: "Balance", value: `${balance}`, inline: true },
    {
      name: "Invited By",
      value: !parent ? "No one" : `<@${parent}>`,
      inline: true,
    },
    {
      name: "Invited Users",
      value:
        children.length === 0
          ? "No one"
          : `${children.map((user) => `<@${user}>`).join(", ")}`,
    },
    {
      name: "Active Links",
      value: codes.length === 0 ? "No one" : `${codes.join(", ")}`,
    },
  ];

  await helper.addFields(data).finish({
    embeds: [
      new EmbedBuilder().setTitle(`Invite report`).setFields(data).setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      }),
    ],
    content:
      !isAdmin && userOption != null
        ? `Only admins can see other users invitation reports`
        : undefined,
  });
};
