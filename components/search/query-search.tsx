"use client";

import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Form from "next/form";
import { Input } from "@/components/ui/input";

export function QuerySearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";

  useEffect(() => {
    if (currentQuery) {
      localStorage.setItem("lastSearchQuery", currentQuery);
    }
  }, [currentQuery]);

  return (
    <Form action="/">
      <Input
        ref={inputRef}
        id="query"
        name="query"
        placeholder="Describe the movie you want"
        defaultValue={currentQuery}
      />
    </Form>
  );
}
