export default function Loading() {
  return (
    <div className="min-h-full px-4 py-6 lg:px-6">
      <div className="max-w-4xl mx-auto animate-pulse">
        {/* Back link */}
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-6" />

        {/* Doc header card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
          {/* Badges row */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Title */}
          <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-3" />

          {/* Description */}
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded mb-4" />

          {/* Meta row + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-md" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-8 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>

        {/* Doc body card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-10">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-8" />
            <div className="h-11 w-full bg-slate-200 dark:bg-slate-700 rounded-xl mb-6" />
            <div className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
