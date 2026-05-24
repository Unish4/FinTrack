function Skeleton({ className = "" }) {
  return (
    <div className={`bg-slate-800 rounded-lg animate-pulse ${className}`} />
  );
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
      <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />

      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/5 rounded" />
        <Skeleton className="h-3 w-2/5 rounded" />
      </div>

      {/* Amount */}
      <Skeleton className="h-4 w-16 rounded shrink-0" />

      {/* Action buttons */}
      <div className="flex gap-1 shrink-0">
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
      </div>
    </div>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <Skeleton className="h-7 w-26 rounded mb-1" />
      <Skeleton className="h-3 w-20 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-6">
      <div className="mb-6 space-y-1.5">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-3 w-52 rounded" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default Skeleton;
