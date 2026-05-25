export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
