import { ChannelType, Collection, TextChannel } from "discord.js";
import getChannels from "./getChannels";

function getTextChannels() {
  const channels = getChannels().filter(
    (channel) => channel.type === ChannelType.GuildText
  );
  return channels as Collection<string, TextChannel>;
}

export default getTextChannels;
