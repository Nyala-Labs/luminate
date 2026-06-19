export function AwardsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-xl bg-zinc-800/50 animate-pulse" />
      ))}
    </div>
  );
}
