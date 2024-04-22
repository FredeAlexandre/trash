import GuildCache from "../../models/GuildCache";
import { getGuild } from ".";
import {
  EmbedBuilder,
  TextChannel,
  MessagePayload,
  MessageCreateOptions,
} from "discord.js";

export default class DiscordLogBuilder {
  private title?: string;
  private description?: string;
  private fields: { name: string; value: string; inline?: boolean }[] = [];
  private author?: { name: string; iconURL?: string };
  private color?: number;

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  isSuccess() {
    this.description = "✅ Success";
    this.color = 5763719;
    return this;
  }

  isFailure(error: string) {
    this.description = "❌ Failure: " + error;
    this.color = 15548997;
    return this;
  }

  addField(name: string, value: string, inline?: boolean) {
    this.fields.push({ name, value, inline });
    return this;
  }

  setAuthor(name: string, iconURL?: string) {
    this.author = { name, iconURL };
    return this;
  }

  async channelSend(options: string | MessagePayload | MessageCreateOptions) {
    const logChannel = await GuildCache.get().getLogChannel();
    if (!logChannel) return;
    const channel = getGuild().channels.cache.get(logChannel);
    if (!channel || !(channel instanceof TextChannel)) return;
    await channel.send(options);
  }

  async sendReport() {
    await this.channelSend({
      embeds: [
        new EmbedBuilder()
          .setTitle(this.title || null)
          .setDescription(this.description || null)
          .setFields(this.fields)
          .setAuthor(this.author || null)
          .setColor(this.color || null),
      ],
    });
  }
}
