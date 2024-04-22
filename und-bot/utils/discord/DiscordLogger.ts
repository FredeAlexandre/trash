import GuildCache from "../../models/GuildCache";
import getGuild from "./getGuild";
import {
  EmbedBuilder,
  TextChannel,
  MessagePayload,
  MessageCreateOptions,
} from "discord.js";

class DiscordLogger extends EmbedBuilder {
  private async _report(
    options: string | MessagePayload | MessageCreateOptions
  ) {
    const logChannel = await GuildCache.get().getLogChannel();
    if (!logChannel) return;
    const channel = getGuild().channels.cache.get(logChannel);
    if (!channel || !(channel instanceof TextChannel)) return;
    await channel.send(options);
  }

  async report(options?: string | MessagePayload | MessageCreateOptions) {
    if (options) await this._report(options);
    await this._report({
      embeds: [this],
    });
  }
}

export default DiscordLogger;
