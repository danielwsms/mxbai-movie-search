import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHighResImageUrl(posterUrl: string): string {
  if (!posterUrl) return "";

  if (posterUrl.includes("m.media-amazon.com") && posterUrl.includes("._V1_")) {
    const baseUrlParts = posterUrl.split("._V1_");
    if (baseUrlParts.length > 0) {
      return `${baseUrlParts[0]}._V1_SX1000.jpg`;
    }
  }
  return posterUrl;
}
