import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
  getActualSeason: publicProcedure.query(({ ctx }) => {
    return ctx.db.season.findFirst({
      orderBy: {
        start: "desc",
      },
      include: {
        matchs: {
          orderBy: {
            start: "asc",
          },
          include: {
            attendances: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }),
  getMatch: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.db.match.findUnique({
      where: {
        id: input,
      },
      include: {
        attendances: {
          include: {
            user: true,
          },
        },
      },
    });
  }),
  setAttendanceForMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        status: z.enum(["PRESENT", "ABSENT", "MAYBE"]),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.matchAttendance.upsert({
        where: {
          match_attendance_unique: {
            matchId: input.matchId,
            userId: ctx.session.user.id,
          },
        },
        create: {
          matchId: input.matchId,
          userId: ctx.session.user.id,
          status: input.status,
        },
        update: {
          status: input.status,
        },
      });
    }),
});
