import { Role, User } from "discord.js";

import * as redisCollectionUtils from "./utils/collection";

import redis from "../services/redis";

export class GuildModel {
  private _admins?: string[];
  private _adminRoles?: string[];

  private _helloTarget?: string;

  private _logChannel?: string;

  private _premierChannel?: string;
  private _premierRegularRole?: string;
  private _premierSubstituteRole?: string;

  getKey(path: string) {
    return `guild.${path}`;
  }

  async isAdmin(user: User) {
    return (await this.getAdmins()).includes(user.id);
  }

  async add(role: Role) {
    const roles = await this.addAdminRoles(role.id);
    const admins = await this.addAdmins(
      role.members.map((member) => member.user.id)
    );
    return [roles, admins];
  }

  async remove(role: Role) {
    const remaingRoles = await this.removeAdminRoles(role.id);
    const toRemove = role.members.filter(
      (m) => !m.roles.cache.hasAny(...remaingRoles)
    );
    const admins = await this.removeAdmins(
      toRemove.map((member) => member.user.id)
    );
    return [remaingRoles, admins];
  }

  async getHelloTarget(update = false) {
    if (!update && this._helloTarget) return this._helloTarget;
    this._helloTarget =
      (await redis.get(this.getKey("helloTarget"))) ?? undefined;
    return this._helloTarget;
  }

  async setHelloTarget(target: string) {
    await redis.set(this.getKey("helloTarget"), target);
    this._helloTarget = target;
    return target;
  }

  async getLogChannel(update = false) {
    if (!update && this._logChannel) return this._logChannel;
    this._logChannel =
      (await redis.get(this.getKey("logChannel"))) ?? undefined;
    return this._logChannel;
  }

  async setLogChannel(channel: string) {
    await redis.set(this.getKey("logChannel"), channel);
    this._logChannel = channel;
    return channel;
  }

  async getPremierChannel(update = false) {
    if (!update && this._premierChannel) return this._premierChannel;
    this._premierChannel =
      (await redis.get(this.getKey("premierChannel"))) ?? undefined;
    return this._premierChannel;
  }

  async setPremierChannel(channel: string) {
    await redis.set(this.getKey("premierChannel"), channel);
    this._premierChannel = channel;
    return channel;
  }

  async getPremierRegularRole(update = false) {
    if (!update && this._premierRegularRole) return this._premierRegularRole;
    this._premierRegularRole =
      (await redis.get(this.getKey("premierRegularRole"))) ?? undefined;
    return this._premierRegularRole;
  }

  async setPremierRegularRole(role: string) {
    await redis.set(this.getKey("premierRegularRole"), role);
    this._premierRegularRole = role;
    return role;
  }

  async getPremierSubstituteRole(update = false) {
    if (!update && this._premierSubstituteRole)
      return this._premierSubstituteRole;
    this._premierSubstituteRole =
      (await redis.get(this.getKey("premierSubstituteRole"))) ?? undefined;
    return this._premierSubstituteRole;
  }

  async setPremierSubstituteRole(role: string) {
    await redis.set(this.getKey("premierSubstituteRole"), role);
    this._premierSubstituteRole = role;
    return role;
  }

  async getAdmins(update = false) {
    if (!update && this._admins) return this._admins;
    this._admins = await redisCollectionUtils.get<string>(
      this.getKey("admins")
    );
    return this._admins;
  }

  async setAdmins(admins: string[]) {
    await redisCollectionUtils.set(this.getKey("admins"), admins);
    this._admins = admins;
    return admins;
  }

  async addAdmin(admin: string) {
    this._admins = await redisCollectionUtils.add(this.getKey("admins"), admin);
    return this._admins;
  }

  async addAdmins(admins: string[]) {
    this._admins = await redisCollectionUtils.addMultiple(
      this.getKey("admins"),
      admins
    );
    return this._admins;
  }

  async removeAdmin(admin: string) {
    this._admins = await redisCollectionUtils.remove(
      this.getKey("admins"),
      admin
    );
    return this._admins;
  }

  async removeAdmins(admins: string[]) {
    this._admins = await redisCollectionUtils.removeMultiple(
      this.getKey("admins"),
      admins
    );
    return this._admins;
  }

  async getAdminsRoles(update = false) {
    if (!update && this._adminRoles) return this._adminRoles;
    this._adminRoles = await redisCollectionUtils.get<string>(
      this.getKey("adminsRoles")
    );
    return this._adminRoles;
  }

  async setAdminsRoles(roles: string[]) {
    await redisCollectionUtils.set(this.getKey("adminsRoles"), roles);
    this._adminRoles = roles;
    return roles;
  }

  async addAdminRoles(role: string) {
    this._adminRoles = await redisCollectionUtils.add(
      this.getKey("adminsRoles"),
      role
    );
    return this._adminRoles;
  }

  async removeAdminRoles(role: string) {
    this._adminRoles = await redisCollectionUtils.remove(
      this.getKey("adminsRoles"),
      role
    );
    return this._adminRoles;
  }
}
