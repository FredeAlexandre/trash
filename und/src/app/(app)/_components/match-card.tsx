"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { MatchWithAttendance } from "~/lib/getActualSeason";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const MatchCardDate = ({ match }: { match: MatchWithAttendance }) => {
  const [relative, setRelative] = useState(true);

  let text = ` · ${hour(match.start)} - ${hour(match.end)}`;

  if (relative) {
    text = relativeTimeString(match.start) + text;
  } else {
    text =
      match.start
        .toLocaleString("fr-fr", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
        .slice(0, -1) + text;
  }

  return (
    <button
      onClick={() => {
        setRelative(!relative);
      }}
    >
      {text}
    </button>
  );
};

const MatchCardRawData = ({ match }: { match: MatchWithAttendance }) => {
  const map_name = match.map;

  return (
    <>
      <Image
        className="rounded"
        alt={`${map_name} Valorant Map`}
        src={`/maps/${map_name}.png`}
        width={380}
        height={215}
      />
      <div className="flex justify-between">
        <h3 className="font-bold">{map_name}</h3>
        <span className="rounded bg-secondary px-2 py-1 text-xs font-semibold uppercase text-white">
          {match.type}
        </span>
      </div>
    </>
  );
};

const validArrayLength = (x: number) => {
  if (x >= 0) return x;
  return 0;
};

export const MatchCard = ({
  match,
  index,
}: {
  match: MatchWithAttendance;
  index: number;
}) => {
  const { data, refetch } = api.match.getMatch.useQuery(match.id, {
    initialData: match,
  });

  const { mutate } = api.match.setAttendanceForMatch.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const { status, data: session } = useSession();

  let attendance = "NOTHING";

  if (!data) return null;

  if (status == "authenticated") {
    const user = data.attendances.find((x) => x.user.id === session.user.id);
    if (user) attendance = user.status;
  }

  return (
    <Card className={cn(data.start < new Date() && "opacity-50")}>
      <CardHeader>
        <CardTitle>Match #{index + 1}</CardTitle>
        <CardDescription>
          <MatchCardDate match={data} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <MatchCardRawData match={data} />
          <div className="flex justify-between">
            <div className="relative flex">
              {data.attendances.map((attendance) => {
                if (attendance.status != "PRESENT") return null;

                return (
                  <Avatar key={attendance.id}>
                    <AvatarImage
                      src={
                        attendance.user.image ??
                        "https://static.thenounproject.com/png/55393-200.png"
                      }
                    />
                    <AvatarFallback>
                      {attendance.user.name
                        ? attendance.user.name.slice(0, 2).toUpperCase()
                        : "X"}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {new Array(
                validArrayLength(
                  5 -
                    data.attendances.filter((x) => x.status == "PRESENT")
                      .length,
                ),
              )
                .fill(0)
                .map((_, id) => {
                  return (
                    <div
                      key={id}
                      className="h-10 w-10 rounded-full bg-gray-800"
                    />
                  );
                })}
            </div>
            <div className="relative flex">
              {data.attendances.map((attendance, i) => {
                if (attendance.status == "PRESENT") return null;

                if (attendance.status == "ABSENT") {
                  return (
                    <div key={i} className="rounded-full bg-red-700">
                      <Avatar className="opacity-50">
                        <AvatarImage
                          src={
                            attendance.user.image ??
                            "https://static.thenounproject.com/png/55393-200.png"
                          }
                        />
                        <AvatarFallback>
                          {attendance.user.name
                            ? attendance.user.name.slice(0, 2).toUpperCase()
                            : "X"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  );
                } else {
                  return (
                    <Avatar className="opacity-50" key={i}>
                      <AvatarImage
                        src={
                          attendance.user.image ??
                          "https://static.thenounproject.com/png/55393-200.png"
                        }
                      />
                      <AvatarFallback>
                        {attendance.user.name
                          ? attendance.user.name.slice(0, 2).toUpperCase()
                          : "X"}
                      </AvatarFallback>
                    </Avatar>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </CardContent>
      {status == "authenticated" && (
        <CardFooter>
          <div className="flex w-full flex-col gap-2">
            <p className="text-xs text-muted-foreground">You want to play ?</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => {
                  mutate({
                    matchId: data.id,
                    status: "PRESENT",
                  });
                }}
                size="sm"
                variant="outline"
                className={cn(
                  "w-full hover:bg-green-700",
                  attendance == "PRESENT" && "bg-green-700",
                )}
              >
                Let&apos;s play
              </Button>
              <Button
                onClick={() => {
                  mutate({
                    matchId: data.id,
                    status: "ABSENT",
                  });
                }}
                size="sm"
                variant="outline"
                className={cn(
                  "w-full hover:bg-red-700",
                  attendance == "ABSENT" && "bg-red-700",
                )}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  mutate({
                    matchId: data.id,
                    status: "MAYBE",
                  });
                }}
                size="sm"
                variant="outline"
                className={cn(
                  "w-full hover:bg-accent hover:text-accent-foreground",
                  attendance == "MAYBE" && "bg-accent text-accent-foreground",
                )}
              >
                Maybe
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

const hour = (time: Date) => {
  return `${time.getHours()}h`;
};

const getDateWithoutTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const relativeTimeString = (date: Date) => {
  const diff =
    getDateWithoutTime(date).getTime() -
    getDateWithoutTime(new Date()).getTime();

  const day = 1000 * 60 * 60 * 24;

  if (diff == 0) return "today";

  if (diff < 0) {
    if (diff == -day) return "yesterday";
    if (diff > -7 * day) return `${Math.floor(Math.abs(diff / day))} days ago`;
    if (diff > -30 * day)
      return `${Math.floor(Math.abs(diff / (7 * day)))} weeks ago`;
    if (diff > -365 * day)
      return `${Math.floor(Math.abs(diff / (30 * day)))} months ago`;
    return `${Math.floor(Math.abs(diff / (365 * day)))} years ago`;
  }

  if (diff > 0) {
    if (diff == day) return "tomorrow";
    if (diff < 7 * day) return `in ${Math.floor(diff / day)} days`;
    if (diff < 30 * day) return `in ${Math.floor(diff / (7 * day))} weeks`;
    if (diff < 365 * day) return `in ${Math.floor(diff / (30 * day))} months`;
    return `in ${Math.floor(diff / (365 * day))} years`;
  }
};
