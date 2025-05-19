import { MovieGrid } from "@/components/movie-grid";
import { use } from "react";
import { SearchLayout } from "@/components/search/search-layout";
import { SearchParams } from "@/types";

export default function Home(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const searchQuery = searchParams.query || null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <SearchLayout />
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <MovieGrid searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
