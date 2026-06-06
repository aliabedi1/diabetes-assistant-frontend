export default function Alert({ children, type = "error" }) {
  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  };

  if (!children) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}
