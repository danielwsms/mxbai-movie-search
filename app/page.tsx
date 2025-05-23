import { MovieGrid } from "@/components/movie-grid";
import { use } from "react";
import { SearchLayout } from "@/components/search/search-layout";
import { SearchParams } from "@/types";

export default function Home(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const searchQuery = searchParams.query || null;

  return (
    <div className="flex flex-col gap-4">
      <SearchLayout />
      <MovieGrid searchQuery={searchQuery} />
    </div>
  );
}
