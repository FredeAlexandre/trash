import { cache } from "react";

import { api } from "~/trpc/server";

export const getActualSeason = cache(async () => {
  return await api.match.getActualSeason.query();
});

export type SeasonWithMatches = NonNullable<
  Awaited<ReturnType<typeof getActualSeason>>
>;

export type MatchWithAttendance = SeasonWithMatches["matchs"][number];

export type AttendanceWithUser = MatchWithAttendance["attendances"][number];
