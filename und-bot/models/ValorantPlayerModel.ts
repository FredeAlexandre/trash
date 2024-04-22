import axios from "axios";

import { EmbedBuilder } from "discord.js";

import { RequestManager } from "../utils";

export class ValorantPlayerModel {
  account?: {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: {
      small: string;
      large: string;
      wide: string;
      id: string;
    };
    last_update_raw: number;
  };

  mmr?: {
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name: string;
    tag: string;
    old: boolean;
  };

  lastAccountUpdate = 0;
  lastMmrUpdate = 0;

  constructor(
    public manager: RequestManager,
    public name: string,
    public tag: string
  ) {}

  async getAccount({ update } = { update: false }) {
    if (
      !(update || this.lastAccountUpdate + 3600 * 24 * 1000 > Date.now()) &&
      this.account
    )
      return this.account;
    const { data } = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/account/${this.name}/${this.tag}?force=true`
    );

    if (data.status != 200) {
      throw new Error(data.errors);
    } else {
      this.account = data.data;
    }
    this.lastAccountUpdate = Date.now();
    return this.account;
  }

  async getMMR({ update } = { update: false }) {
    if (
      !(update || this.lastMmrUpdate + 3600 * 24 * 1000 > Date.now()) &&
      this.mmr
    )
      return this.mmr;
    const { data } = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${this.name}/${this.tag}`
    );

    if (data.status != 200) {
      throw new Error(data.errors);
    } else {
      this.mmr = data.data;
    }
    this.lastMmrUpdate = Date.now();
    return this.mmr;
  }

  async get({ update } = { update: false }) {
    return await Promise.all([
      this.getAccount({ update }),
      this.getMMR({ update }),
    ]);
  }

  embed() {
    if (!this.account || !this.mmr) return;
    return new EmbedBuilder()
      .setTitle(`${this.name}#${this.tag} Card`)
      .setImage(this.account.card.wide)
      .setThumbnail(this.mmr.images.large)
      .addFields([
        { name: "Level", value: `${this.account.account_level}`, inline: true },
        { name: "Region", value: `${this.account.region}`, inline: true },
        { name: "Rank", value: `${this.mmr.currenttierpatched}`, inline: true },
        {
          name: "Current Tier",
          value: `${this.mmr.currenttier}`,
          inline: true,
        },
        {
          name: "Ranking In Tier",
          value: `${this.mmr.ranking_in_tier}`,
          inline: true,
        },
        { name: "MMR", value: `${this.mmr.elo}`, inline: true },
      ]);
  }
}
