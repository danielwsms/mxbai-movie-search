import Link from "next/link";
import ThemeToggler from "./theme-toggler";

export default function Header() {
  return (
    <header className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
      <div className="border border-border/80 rounded-xl bg-card/80 backdrop-blur-md h-12 md:h-16 flex justify-between items-center gap-2 px-4 shadow-sm">
        <div className="flex-1 flex items-center">
          {" "}
          <Link href="/" className="flex items-center space-x-2 shrink-0 px-2">
            <img src="/logo_mb.svg" alt="MemeLM Logo" className="h-8 w-8" />
          </Link>
        </div>

        <div className="grow flex justify-center"></div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
