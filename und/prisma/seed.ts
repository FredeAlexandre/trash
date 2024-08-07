import { PrismaClient } from "@prisma/client";

import { z } from "zod";

const uuidSchema = z.string().uuid();

const isoDateSchema = z.string().transform((date) => new Date(date));

const MapSchema = z.object({
  name: z.enum([
    "Ascent",
    "Split",
    "Fracture",
    "Bind",
    "Breeze",
    "Lotus",
    "Sunset",
    "Pearl",
    "Icebox",
    "Haven",
  ]),
  id: uuidSchema,
});

const MapSelectionSchema = z.object({
  type: z.enum(["RANDOM", "PICKBAN"]),
  maps: z.array(MapSchema),
});

type MapSelection = z.infer<typeof MapSelectionSchema>;

const ConferenceSchema = z.enum([
  "EU_CENTRAL_EAST",
  "EU_MIDDLE_EAST",
  "EU_TURKEY",
  "EU_WEST",
  "EU_NORTH",
  "EU_FRANCE",
  "EU_IBIT",
  "EU_EAST",
  "EU_DACH",
]);

const ConferenceScheduleSchema = z.object({
  conference: ConferenceSchema,
  starts_at: isoDateSchema,
  ends_at: isoDateSchema,
});

const EventSchema = z.object({
  id: uuidSchema,
  type: z.enum(["LEAGUE", "SCRIM", "TOURNAMENT"]),
  starts_at: isoDateSchema,
  ends_at: isoDateSchema,
  conference_schedules: z.array(ConferenceScheduleSchema),
  map_selection: MapSelectionSchema,
  points_required_to_participate: z.number(),
});

const ScheduledEventSchema = z.object({
  event_id: uuidSchema,
  conference: ConferenceSchema,
  starts_at: isoDateSchema,
  ends_at: isoDateSchema,
});

const SeasonSchema = z.object({
  id: uuidSchema,
  championship_event_id: uuidSchema,
  championship_points_required: z.number(),
  starts_at: isoDateSchema,
  ends_at: isoDateSchema,
  enrollment_starts_at: isoDateSchema,
  enrollment_ends_at: isoDateSchema,
  events: z.array(EventSchema),
  scheduled_events: z.array(ScheduledEventSchema),
});

const PremierSeasonResponseSchema = z.object({
  status: z.number(),
  data: z.array(SeasonSchema),
});

type Match = {
  id: string;
  start: Date;
  end: Date;
  map: string;
  type: "LEAGUE" | "TOURNAMENT" | "SCRIM";
  required_points: number;
  seasonId: string;
};

const prisma = new PrismaClient();

async function get_premier_seasons() {
  const response = await fetch(
    "https://api.henrikdev.xyz/valorant/v1/premier/seasons/eu",
  );

  const json: unknown = await response.json();

  const { data } = PremierSeasonResponseSchema.parse(json);

  return data;
}

const getMapName = (selection: MapSelection) => {
  if (selection.type == "RANDOM") {
    const _map = selection.maps[0];
    if (_map) {
      return _map.name;
    }
  }
  return "PICKBAN";
};

async function seed_seasons() {
  console.log("seeding seasons...");
  const seasons = await get_premier_seasons();

  const transformed = seasons.map(
    ({
      id,
      starts_at,
      ends_at,
      enrollment_starts_at,
      enrollment_ends_at,
      events,
      scheduled_events,
    }) => {
      let matches: Match[] = [];

      if (scheduled_events.length > 0) {
        const _matches = events.map((event) => {
          const scheduleds = scheduled_events.filter((scheduled) => {
            if (scheduled.conference != "EU_FRANCE") return false;
            return scheduled.event_id == event.id;
          });
          return scheduleds.map(({ starts_at, ends_at }, i) => {
            let map = getMapName(event.map_selection);

            return {
              id: event.id + "." + i,
              start: starts_at,
              end: ends_at,
              map,
              type: event.type,
              required_points: event.points_required_to_participate,
              seasonId: id,
            };
          });
        });

        _matches.forEach((x) => {
          matches = [...x, ...matches];
        });
      } else {
        const _matches = events.map((event) => {
          let scheduled = event.conference_schedules.find((conference) => {
            return conference.conference == "EU_WEST";
          });

          if (!scheduled) {
            scheduled = {
              starts_at: event.starts_at,
              ends_at: event.ends_at,
              conference: "EU_WEST",
            };
          }

          let map = getMapName(event.map_selection);

          return {
            id: event.id,
            start: starts_at,
            end: ends_at,
            map,
            type: event.type,
            required_points: event.points_required_to_participate,
            seasonId: id,
          };
        });

        _matches.forEach((x) => {
          matches.push(x);
        });
      }

      return {
        id,
        start: starts_at,
        end: ends_at,
        enrollment_start: enrollment_starts_at,
        enrollment_end: enrollment_ends_at,
        matches,
      };
    },
  );

  const season_queries = transformed.map((season) => ({
    where: {
      id: season.id,
    },
    update: {},
    create: {
      id: season.id,
      start: season.start,
      end: season.end,
      enrollment_start: season.enrollment_start,
      enrollment_end: season.enrollment_end,
    },
  }));

  for (let i = 0; i < season_queries.length; i++) {
    const query = season_queries[i];
    if (!query) continue;
    console.log("creating season uuid: " + query.where.id);
    await prisma.season.upsert(query);
  }

  const match_queries = transformed
    .map((season) => {
      return season.matches.map((match) => ({
        where: {
          id: match.id,
        },
        update: {},
        create: match,
      }));
    })
    .reduce((final, promises) => {
      return [...final, ...promises];
    });

  for (let i = 0; i < match_queries.length; i++) {
    const query = match_queries[i];
    if (!query) continue;
    console.log("creating match uuid: " + query.where.id);
    await prisma.match.upsert(query);
  }
}

async function main() {
  await seed_seasons();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
