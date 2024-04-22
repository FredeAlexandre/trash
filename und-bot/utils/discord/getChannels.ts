import getGuild from "./getGuild";

function getChannels() {
  return getGuild().channels.cache;
}

export default getChannels;
