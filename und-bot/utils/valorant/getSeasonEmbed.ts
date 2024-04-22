import { EmbedBuilder } from "discord.js";
import { PremierSeason } from "./types";

function prettyDate(date: Date) {
  return date.toLocaleString("fr-fr", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function getSeasonEmbed(n: number, season: PremierSeason) {
  return new EmbedBuilder().setTitle(`Season ${n}`).addFields([
    {
      name: "Enrollment Start",
      value: prettyDate(season.enrollment_starts_at),
      inline: true,
    },
    {
      name: "Enrollment Ends",
      value: prettyDate(season.enrollment_ends_at),
      inline: true,
    },
    {
      name: "Points Required",
      value: `${season.championship_points_required}`,
      inline: true,
    },
    {
      name: "Season Start",
      value: prettyDate(season.starts_at),
      inline: true,
    },
    {
      name: "Season Ends",
      value: prettyDate(season.ends_at),
      inline: true,
    },
    {
      name: "Id",
      value: season.id,
      inline: false,
    },
  ]);
}

export default getSeasonEmbed;
