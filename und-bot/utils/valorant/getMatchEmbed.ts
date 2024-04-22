import { EmbedBuilder } from "discord.js";
import { PremierSeasonEvent } from "./types";

function prettyDate(date: Date) {
  return date.toLocaleString("fr-fr", {
    hour: "numeric",
    minute: "numeric",
  });
}

function isSingleMap(match: PremierSeasonEvent) {
  return match.map_selection.maps.length == 1;
}

function setMapFields(
  match: PremierSeasonEvent,
  fields: { name: string; value: string; inline: boolean }[]
) {
  if (!isSingleMap(match)) {
    fields.push({
      name: "Map Selection",
      value: match.map_selection.type,
      inline: true,
    });
    fields.push({
      name: "Maps",
      value: match.map_selection.maps.map((m) => m.name).join(", "),
      inline: true,
    });
  }
  return fields;
}

function setImage(match: PremierSeasonEvent, embed: EmbedBuilder) {
  if (isSingleMap(match)) {
    embed.setImage(
      `https://media.valorant-api.com/maps/${match.map_selection.maps[0].id}/splash.png`
    );
  }
  return embed;
}

function getMatchEmbed(
  n: number,
  match: PremierSeasonEvent,
  _options?: {
    showId?: boolean;
  }
) {
  let options = {
    showId: false,
    ..._options,
  };
  let fields = [];

  fields.push({
    name: "Start",
    value: prettyDate(match.starts_at),
    inline: true,
  });

  fields.push({
    name: "End",
    value: prettyDate(match.ends_at),
    inline: true,
  });

  if (match.points_required_to_participate > 0) {
    fields.push({
      name: "Points Required",
      value: `${match.points_required_to_participate}`,
      inline: true,
    });
  }

  fields.push({
    name: "Type",
    value: `${match.type}`,
    inline: true,
  });

  fields = setMapFields(match, fields);

  if (options.showId) {
    fields.push({
      name: "Id",
      value: match.id,
      inline: false,
    });
  }

  return setImage(
    match,
    new EmbedBuilder()
      .setTitle(
        `Match ${n} - ${match.starts_at.toLocaleString("fr-fr", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}`
      )
      .addFields(fields)
  );
}

export default getMatchEmbed;
