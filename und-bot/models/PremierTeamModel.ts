import axios from "axios";

import { EmbedBuilder } from "discord.js";

import { RequestManager } from "../utils";

export class PremierTeamModel {
  data?: {
    id: string;
    name: string;
    tag: string;
    enrolled: boolean;
    stats: {
      wins: number;
      losses: number;
      matches: number;
    };
    placement: {
      points: number;
      conference: string;
      division: string;
      place: number;
    };
    customization: {
      icon: string;
      image: string;
      primary: string;
      secondary: string;
      tertiary: string;
    };
    member: {
      puuid: string;
      name: string;
      tag: string;
    }[];
  };

  lastUpdate = 0;

  constructor(
    public manager: RequestManager,
    public name: string,
    public tag: string
  ) {}

  async get({ update } = { update: false }) {
    if (
      !(update || this.lastUpdate + 3600 * 24 * 1000 > Date.now()) &&
      this.data
    )
      return this.data;
    const { data } = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/premier/${this.name}/${this.tag}}`
    );
    if (data.status != 200) {
      throw new Error(data.errors);
    } else {
      this.data = data.data;
    }
    this.lastUpdate = Date.now();
    return this.data;
  }

  embed() {
    if (!this.data) return;
    return new EmbedBuilder()
      .setTitle(`${this.name}#${this.tag} Card`)
      .addFields([
        {
          name: "Players",
          value: `${this.data.member
            .map((p) => `${p.name}#${p.tag}`)
            .join(", ")}`,
        },
        { name: "Wins", value: `${this.data.stats.wins}`, inline: true },
        { name: "Losses", value: `${this.data.stats.losses}`, inline: true },
        { name: "Matches", value: `${this.data.stats.matches}`, inline: true },
        {
          name: "Points",
          value: `${this.data.placement.points}`,
          inline: true,
        },
        {
          name: "Division",
          value: `${this.data.placement.division}`,
          inline: true,
        },
        { name: "Place", value: `${this.data.placement.place}`, inline: true },
      ])
      .setThumbnail(this.data.customization.image)
      .setColor(Number(this.data.customization.primary.replace("#", "0x")));
  }
}
