import discord from "../services/discord";
import logger from "../services/logger";

import premier, { PremierBot } from "../services/premier";
import { getGuild } from "../utils";
import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  Interaction,
} from "discord.js";

async function hasError(interaction: Interaction<CacheType>, error: string) {
  interaction.isRepliable() &&
    (await interaction.reply({
      content: error,
      ephemeral: true,
    }));
}

discord.on("interactionCreate", async (interaction) => {
  try {
    console.log("[BOT] Interaction created");
    if (interaction.isChatInputCommand()) return;
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("premier")) return;
    const [_, action, matchId] = interaction.customId.split(":");
    const tracking = premier.getMatch(matchId);

    if (!tracking)
      return hasError(interaction, "Button link to a match not found !");

    const channel = await PremierBot.getChannel();
    if (!channel)
      return hasError(
        interaction,
        "The channel for the organisation is not set !"
      );

    await interaction.deferUpdate();

    let playButton = new ButtonBuilder()
      .setCustomId(`premier:accept:${matchId}`)
      .setLabel("Play")
      .setStyle(ButtonStyle.Success);
    let declineButton = new ButtonBuilder()
      .setCustomId(`premier:decline:${matchId}`)
      .setLabel("Decline")
      .setStyle(ButtonStyle.Danger);

    if (action == "accept") {
      if (tracking.declined.includes(interaction.user.id)) {
        tracking.declined = tracking.declined.filter(
          (u) => u != interaction.user.id
        );
      }
      if (!tracking.accepted.includes(interaction.user.id)) {
        tracking.accepted.push(interaction.user.id);
      }
      playButton.setDisabled(true);
    }

    if (action == "decline") {
      if (tracking.accepted.includes(interaction.user.id)) {
        tracking.accepted = tracking.accepted.filter(
          (u) => u != interaction.user.id
        );
      }
      if (!tracking.declined.includes(interaction.user.id))
        tracking.declined.push(interaction.user.id);
      declineButton.setDisabled(true);
    }

    await premier.updatePost(tracking);
    await premier.backupMatches();

    await interaction.message.edit({
      embeds: interaction.message.embeds,
      components: [
        // @ts-ignore
        new ActionRowBuilder().addComponents(
          playButton,
          declineButton,
          new ButtonBuilder()
            .setLabel("Check post")
            .setStyle(ButtonStyle.Link)
            .setURL(
              `https://discord.com/channels/${getGuild().id}/${channel.id}/${
                tracking.messageId
              }`
            )
        ),
      ],
    });
  } catch (error) {
    logger.error("@interactionCreate", error, interaction);
  }
});
