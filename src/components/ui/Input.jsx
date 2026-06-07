export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-900/50 ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-sm text-rose-600 dark:text-rose-400">{error}</span>}
    </label>
  );
}
