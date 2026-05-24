import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Page not found</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
