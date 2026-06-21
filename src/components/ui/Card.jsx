export default function Card({ children, className = "", ...rest }) {
  return (
    <div {...rest} className={`rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}
