import * as redisNumberUtils from "./utils/number";

import redis from "../services/redis";

export class InviteModel {
  private _uses?: number;
  private _creator?: string;

  constructor(public invite_code: string) {}

  getKey(path: string) {
    return `(Invite:${this.invite_code}).${path}`;
  }

  async getUses(update = false) {
    if (!update && this._uses) return this._uses;
    this._uses = await redisNumberUtils.get(this.getKey("uses"));
    return this._uses;
  }

  async setUses(uses: number) {
    await redisNumberUtils.set(this.getKey("uses"), uses);
    this._uses = uses;
    return uses;
  }

  async addUses(amount: number) {
    this._uses = await redisNumberUtils.add(this.getKey("uses"), amount);
    return this._uses;
  }

  async removeUses(amount: number) {
    this._uses = await redisNumberUtils.remove(this.getKey("uses"), amount);
    return this._uses;
  }

  async getCreator(update = false) {
    if (!update && this._creator) return this._creator;
    this._creator = (await redis.get(this.getKey("creator"))) ?? undefined;
    return this._creator;
  }

  async setCreator(creator: string) {
    await redis.set(this.getKey("creator"), creator);
    this._creator = creator;
    return creator;
  }
}
