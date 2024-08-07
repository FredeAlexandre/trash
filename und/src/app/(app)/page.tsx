import { getActualSeason } from "~/lib/getActualSeason";

import { SeasonCarousel } from "./_components/season-carousel";

export default async function Home() {
  const season = await getActualSeason();

  return (
    <>
      <div className="h-14" />
      {season ? <SeasonCarousel season={season} /> : <SeasonCarousel />}
    </>
  );
}

export const revalidate = 0;
