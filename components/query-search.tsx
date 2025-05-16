"use client";

import { useRef, useEffect } from "react";
import Form from "next/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Keyboard } from "lucide-react";

export function QuerySearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInTextField = ["INPUT", "TEXTAREA"].includes(target?.tagName);

      if (event.key === "1" && !isInTextField) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <Card className="p-0 shadow-none flex-1">
      <Form action="/" className="flex gap-2 relative">
        <Input
          ref={inputRef}
          name="query"
          placeholder="Retrieve movies using semantic search"
          className="flex-1 pr-24"
          aria-label="Retrieve movies using semantic search, press 1 to focus"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs">
            <div className="flex items-center justify-center bg-secondary text-secondary-foreground h-4 w-4 rounded">
              <span>1</span>
            </div>
            <span>to focus</span>
          </div>
        </div>
      </Form>
    </Card>
  );
}
