import { ApplicationCommandOptionType, TextChannel } from "discord.js";

import { DiscordInteractionHelper, waitWithTimeout } from "../../utils";

const deleteMessage = async (channel: TextChannel, amount: number) => {
  try {
    let i = Math.floor(amount / 100);
    let j = amount % 100;
    while (i > 0) {
      await channel.bulkDelete(100);
      i--;
    }
    await channel.bulkDelete(j);
  } catch (error) {
    return;
  }
};

export const name = "bulk";

export const description = "Let you delete multiple messages at once";

export const options = [
  {
    name: "amount",
    description: "The amount of messages to delete",
    type: ApplicationCommandOptionType.Integer,
    required: true,
    min_value: 1,
  },
] as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const [amountOption] = helper.getOptions(options);
  const amount = amountOption ?? 10;
  const channel = helper.interaction.channel;

  if (!(await helper.onlyAdmin())) return;

  if (!channel) {
    return await helper
      .toggleError("Invaiid channel")
      .finish("You can only set a text channel as a log channel");
  }

  if (!(channel instanceof TextChannel)) {
    return await helper
      .toggleError("Invaiid channel")
      .finish("You can only set a text channel as a log channel");
  }

  await waitWithTimeout(deleteMessage(channel, amount), 3000, async () => {
    await helper.send(`Deleting ${amount} messages...`);
  });
  await helper.finish("Done!");
};
