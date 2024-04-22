import { InviteModel } from "./InviteModel";

import * as redisCollectionUtils from "./utils/collection";

class InvitesCache {
  codes: Map<string, InviteModel> = new Map();

  private _lastUses?: string[];

  get(code_id: string) {
    let code = this.codes.get(code_id);
    if (code) return code;
    code = new InviteModel(code_id);
    this.codes.set(code_id, code);
    return code;
  }

  async getLastUses(update = false) {
    if (!update && this._lastUses) return this._lastUses;
    const result = await redisCollectionUtils.get<string>("invite.last_uses");
    this._lastUses = result;
    return result;
  }

  async setLastUses(last_uses: string[]) {
    await redisCollectionUtils.set("invite.last_uses", last_uses);
    this._lastUses = last_uses;
    return last_uses;
  }

  async addLastUses(user_id: string) {
    this._lastUses = await redisCollectionUtils.add(
      "invite.last_uses",
      user_id
    );
    return this._lastUses;
  }

  async removeLastUses(user_id: string) {
    this._lastUses = await redisCollectionUtils.remove(
      "invite.last_uses",
      user_id
    );
    return this._lastUses;
  }
}

const cache = new InvitesCache();

export default cache;
