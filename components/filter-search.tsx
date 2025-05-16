"use client";

import { useRef } from "react";
import Form from "next/form";
import { Input } from "@/components/ui/input";

export function FilterSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Form action="/">
      <Input
        ref={inputRef}
        id="filter"
        name="filter"
        placeholder="Anything you can think of"
      />
    </Form>
  );
}
