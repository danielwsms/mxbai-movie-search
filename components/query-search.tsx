"use client";

import { useRef } from "react";
import Form from "next/form";
import { Input } from "@/components/ui/input";

export function QuerySearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Form action="/">
      <Input
        ref={inputRef}
        id="query"
        name="query"
        placeholder="Describe the movie you want"
      />
    </Form>
  );
}
