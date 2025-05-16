import { MovieGrid } from "@/components/movie-grid";
import { QuerySearch } from "@/components/query-search";
import { FilterSearch } from "@/components/filter-search";
import { use } from "react";
import { SearchLayout } from "@/components/search-layout";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Home(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const searchQuery = searchParams.query || null;
  const filterQuery = searchParams.filter || null;

  return (
    <div className="container py-24 space-y-4">
      <SearchLayout />
      <MovieGrid searchQuery={searchQuery} filterQuery={filterQuery} />
    </div>
  );
}
