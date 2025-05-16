export default function Header() {
  return (
    <header className="fixed top-4 w-full z-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="border border-border/80 rounded-xl bg-card/80 backdrop-blur-md h-12 md:h-16 flex justify-between items-center gap-2 px-4 shadow-sm">
          {/* Left area */}
          <div className="flex-1 flex items-center">A</div>
          {/* Center area */}
          <div className="grow flex justify-center">B</div>
          {/* Right area */}
          <div className="flex-1 flex justify-end items-center gap-4">C</div>
        </div>
      </div>
    </header>
  );
}
