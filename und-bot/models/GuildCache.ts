import { GuildModel } from "./GuildModel";

class GuildCache {
  instance: GuildModel = new GuildModel();

  get() {
    return this.instance;
  }
}

const cache = new GuildCache();

export default cache;
