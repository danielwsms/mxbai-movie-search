"use client";

import { useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";

export function RecommendationsFilterSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "";

  return (
    <Card className="p-0">
      <Form action="">
        <Input
          ref={inputRef}
          id="filter"
          name="filter"
          placeholder="Rerank recommendations"
          defaultValue={currentFilter}
        />
      </Form>
    </Card>
  );
}
