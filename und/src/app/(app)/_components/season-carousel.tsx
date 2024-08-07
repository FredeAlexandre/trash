"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import type { SeasonWithMatches } from "~/lib/getActualSeason";
import { api } from "~/trpc/react";

import { MatchCard } from "./match-card";
import UndrawVoid from "../../../../public/images/undraw_void.svg";

function NoSeasonFound() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* eslint-disable-next-line */}
      <Image src={UndrawVoid} alt="undraw void" className="w-32" />
      <Alert className="max-w-[32rem]">
        <X className="h-4 w-4" />
        <AlertTitle>No data found</AlertTitle>
        <AlertDescription>
          Please ask the admin to add the premier seasons to the database.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function SeasonCarousel({ season }: { season?: SeasonWithMatches }) {
  const { data } = api.match.getActualSeason.useQuery(undefined, {
    initialData: season,
  });

  if (!data) return <NoSeasonFound />;

  const matches = data.matchs;

  const now = new Date();

  const startIndex =
    matches.findIndex((match) => {
      return match.start > now;
    }) - 1;

  return (
    <>
      <Carousel opts={{ startIndex }}>
        <CarouselContent>
          {matches.map((match, id) => {
            return (
              <CarouselItem className="basis-10/12 sm:basis-[26rem]" key={id}>
                <MatchCard match={match} index={id} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="invisible right-12 sm:visible" />
        <CarouselPrevious className="invisible left-12 sm:visible" />
      </Carousel>
    </>
  );
}
