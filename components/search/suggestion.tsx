import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SuggestionProps {
  query: string;
}

export function Suggestion({ query }: SuggestionProps) {
  return (
    <Link
      href={`/?query=${query}`}
      prefetch
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        "h-7 max-w-[calc(100vw-3rem)] gap-1 bg-theme-background px-2 focus-visible:ring-theme/60"
      )}
    >
      <span className="max-w-[393px] truncate">{query}</span>

      <ArrowUpRightIcon className="!size-3.5" />
    </Link>
  );
}
