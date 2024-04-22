import { PremierSeasonEvent, getGuild, getMatchEmbed } from "../utils";

import redis from "../services/redis";

import HenrikCache from "../models/HenrikCache";

import GuildCache from "../models/GuildCache";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

function getStartOfWeek(timestamp: number) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const tmpdate = new Date(timestamp - daysToSubtract * oneDayMs);
  tmpdate.setHours(0, 0, 0, 0);

  return tmpdate.getTime();
}

function getEndOfWeek(timestamp: number) {
  return getStartOfWeek(timestamp) + 7 * 24 * 60 * 60 * 1000;
}

interface TrackingMatch
  extends Omit<PremierSeasonEvent, "conference_schedules"> {
  messageId?: string;
  declined: string[];
  accepted: string[];
}

export class PremierBot {
  matches: TrackingMatch[] = [];

  private timeout?: NodeJS.Timeout;
  private interval?: NodeJS.Timer;

  async start() {
    this.stop();
    if (!(await this.restoreMatches())) {
      await this.update();
    }
  }

  async stop() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this.matches = [];
  }

  async update() {
    await this.clear();
    await this.setMatches(await this.getMatches());
    await this.post();
    await this.ping();
    if (this.matches.length > 0) {
      this.interval = setInterval(() => {
        this.ping();
      }, 1000 * 60 * 60 * 24);
    }
  }

  async clear() {
    const channel = await PremierBot.getChannel();
    if (!channel) return;
    await Promise.all(
      this.matches.map(async (m) => {
        if (!m.messageId) return;
        try {
          const message = await channel.messages.fetch(m.messageId);
          if (message.deletable) await message.delete();
        } catch (error) {
          return;
        }
      })
    );
  }

  async post() {
    const channel = await PremierBot.getChannel();
    if (!channel) return;
    if (this.matches.length === 0) {
      await channel.send(
        "No matches found for this week, i will check tomorrow again"
      );
    }
    for (let i = 0; i < this.matches.length; i++) {
      const m = this.matches[i];

      const message = await channel.send(
        await PremierBot.createMatchPost(i + 1, m)
      );

      this.matches[i] = {
        ...m,
        messageId: message.id,
      };
    }
  }

  async updatePost(match: TrackingMatch) {
    const channel = await PremierBot.getChannel();
    if (!channel) return;
    if (!match.messageId) return;
    const message = await channel.messages.fetch(match.messageId);
    await message.edit(
      await PremierBot.createMatchPost(
        this.matches.findIndex((m) => m.id === match.id) + 1,
        match
      )
    );
  }

  async ping() {
    const channel = await PremierBot.getChannel();
    if (!channel) return;
    const regulars = await PremierBot.getRegulars();
    const substitutes = await PremierBot.getSubstitute();
    const everyone = [...regulars, ...substitutes];

    const toPing = everyone
      .map((u) => {
        let missing: TrackingMatch[] = [];
        for (let i = 0; i < this.matches.length; i++) {
          const match = this.matches[i];
          if (match.ends_at.getTime() < Date.now()) continue;
          if (match.accepted.find((a) => a === u.id)) continue;
          if (match.declined.find((a) => a === u.id)) continue;
          missing.push(match);
        }
        return {
          user: u,
          missing: missing,
        };
      })
      .filter((x) => x.missing.length > 0);

    await Promise.all(
      toPing.map(async (x) => {
        await x.user.send(
          `Tu dois encore valider ta disponibilité pour ${
            x.missing.length
          } match${x.missing.length > 1 ? "s" : ""}`
        );

        await Promise.all(
          x.missing.map((m, i) => {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`premier:accept:${m.id}`)
                .setLabel("Play")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`premier:decline:${m.id}`)
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setLabel("Check post")
                .setStyle(ButtonStyle.Link)
                .setURL(
                  `https://discord.com/channels/${getGuild().id}/${
                    channel.id
                  }/${m.messageId}`
                )
            );

            const matchEmbed = getMatchEmbed(i, {
              ...m,
              conference_schedules: [],
            });

            return x.user.send({
              embeds: [matchEmbed],
              // @ts-ignore
              components: [row],
            });
          })
        );
      })
    );
  }

  async restoreMatches() {
    const matchesJson = await redis.get("premier:matches");
    if (!matchesJson) return false;
    const matches = JSON.parse(matchesJson) as TrackingMatch[];
    return await this.setMatches(
      matches.map((m) => {
        return {
          ...m,
          starts_at: new Date(m.starts_at),
          ends_at: new Date(m.ends_at),
        };
      })
    );
  }

  async backupMatches() {
    await redis.set("premier:matches", JSON.stringify(this.matches));
  }

  async getMatches() {
    const seasons = await HenrikCache.getSeasons({ update: true });
    if (!seasons || seasons.length == 0) throw new Error("No seasons found");
    const lastSeason = seasons[seasons.length - 1];
    const matches = lastSeason.events;
    if (matches.length == 0) return [];
    const now = Date.now();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);

    const result = matches
      .filter(
        (m) =>
          m.starts_at.getTime() >= startOfWeek &&
          m.ends_at.getTime() <= endOfWeek
      )
      .map((m) => {
        return {
          ...m,
          accepted: [],
          declined: [],
        };
      });
    return result as TrackingMatch[];
  }

  async setMatches(matches: TrackingMatch[]) {
    if (matches.length === 0) {
      this.matches = [];
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.update();
      }, 1000 * 60 * 60 * 24);
      return false;
    }
    const last = matches[matches.length - 1];
    const end = getEndOfWeek(last.starts_at.getTime());
    if (Date.now() > end) {
      this.matches = [];
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.update();
      }, 1000 * 60 * 60 * 24);
      return false;
    }
    this.timeout = setTimeout(() => {
      this.update();
    }, end - Date.now() + 1000);
    this.matches = matches;
    await this.backupMatches();
    return true;
  }

  getMatch(id: string) {
    return this.matches.find((m) => m.id === id);
  }

  static async createMatchPost(n: number, match: TrackingMatch) {
    return {
      embeds: [
        getMatchEmbed(n, { ...match, conference_schedules: [] })
          .addFields({
            name: "Accepted",
            value:
              match.accepted.length > 0
                ? match.accepted.map((x) => `<@${x}>`).join(", ")
                : "No one",
          })
          .addFields({
            name: "Declined",
            value:
              match.declined.length > 0
                ? match.declined.map((x) => `<@${x}>`).join(", ")
                : "No one",
          }),
      ],
    };
  }

  static async getChannel() {
    const channelId = await GuildCache.get().getPremierChannel();
    if (!channelId) return undefined;
    const channel = getGuild().channels.cache.get(channelId);
    if (!channel) return undefined;
    if (!(channel instanceof TextChannel)) return undefined;
    return channel;
  }

  static async getRoleMembers(roleId?: string) {
    if (!roleId) return [];
    const role = getGuild().roles.cache.get(roleId);
    if (!role) return [];
    return role.members.map((m) => m.user);
  }

  static async getRegulars() {
    return PremierBot.getRoleMembers(
      await GuildCache.get().getPremierRegularRole()
    );
  }

  static async getSubstitute() {
    return PremierBot.getRoleMembers(
      await GuildCache.get().getPremierSubstituteRole()
    );
  }
}

const premier = new PremierBot();

export default premier;
