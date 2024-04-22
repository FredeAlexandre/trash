import * as redisNumberUtils from "./utils/number";
import * as redisCollectionUtils from "./utils/collection";

import redis from "../services/redis";

export class UserModel {
  private _balance?: number;
  private _parent?: string;
  private _children?: string[];
  private _codes?: string[];

  constructor(public user_id: string) {}

  getKey(path: string) {
    return `(User:${this.user_id}).${path}`;
  }

  async getInviteBalance(update = false) {
    if (!update && this._balance) return this._balance;
    this._balance = await redisNumberUtils.get(this.getKey("invite.balance"));
    return this._balance;
  }

  async setInviteBalance(balance: number) {
    await redisNumberUtils.set(this.getKey("invite.balance"), balance);
    this._balance = balance;
    return balance;
  }

  async addInviteBalance(amount: number) {
    this._balance = await redisNumberUtils.add(
      this.getKey("invite.balance"),
      amount
    );
    return this._balance;
  }

  async removeInviteBalance(amount: number) {
    this._balance = await redisNumberUtils.remove(
      this.getKey("invite.balance"),
      amount
    );
    return this._balance;
  }

  async getInviteParent(update = false) {
    if (!update && this._parent) return this._parent;
    this._parent = (await redis.get(this.getKey("invite.parent"))) ?? undefined;
    return this._parent;
  }

  async setInviteParent(parent: string) {
    await redis.set(this.getKey("invite.parent"), parent);
    this._parent = parent;
    return parent;
  }

  async getInviteChildren(update = false) {
    if (!update && this._children) return this._children;
    this._children = await redisCollectionUtils.get(
      this.getKey("invite.children")
    );
    return this._children;
  }

  async setInviteChildren(children: string[]) {
    await redisCollectionUtils.set(this.getKey("invite.children"), children);
    this._children = children;
    return children;
  }

  async addInviteChildren(child: string) {
    this._children = await redisCollectionUtils.add(
      this.getKey("invite.children"),
      child
    );
    return this._children;
  }

  async removeInviteChildren(child: string) {
    this._children = await redisCollectionUtils.remove(
      this.getKey("invite.children"),
      child
    );
    return this._children;
  }

  async getInviteCodes(update = false) {
    if (!update && this._codes) return this._codes;
    this._codes = await redisCollectionUtils.get(this.getKey("invite.codes"));
    return this._codes;
  }

  async setInviteCodes(codes: string[]) {
    await redisCollectionUtils.set(this.getKey("invite.codes"), codes);
    this._codes = codes;
    return codes;
  }

  async addInviteCode(code: string) {
    this._codes = await redisCollectionUtils.add(
      this.getKey("invite.codes"),
      code
    );
    return this._codes;
  }

  async removeInviteCode(code: string) {
    this._codes = await redisCollectionUtils.remove(
      this.getKey("invite.codes"),
      code
    );
    return this._codes;
  }
}
