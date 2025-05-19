"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function BackButton() {
  const [lastSearch, setLastSearch] = useState("");

  useEffect(() => {
    const storedQuery = localStorage.getItem("lastSearchQuery");
    if (storedQuery) {
      setLastSearch(storedQuery);
    }
  }, []);

  const href = lastSearch ? `/?query=${encodeURIComponent(lastSearch)}` : "/";

  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
    >
      ← Back to search
    </Link>
  );
}
