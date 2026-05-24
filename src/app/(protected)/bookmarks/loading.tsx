export default function Loading() {
  return (
    <div className="px-4 py-8 lg:px-8 max-w-6xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div>
          <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700" />
            <div className="p-5">
              <div className="flex justify-between mb-3">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-1" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="flex gap-1.5">
                <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-md" />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
