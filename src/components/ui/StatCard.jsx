import Card from "./Card";

export default function StatCard({ label, value, hint, tone = "sky" }) {
  const tones = {
    sky: "from-sky-500 to-cyan-400",
    emerald: "from-emerald-500 to-teal-400",
    violet: "from-violet-500 to-fuchsia-400",
    amber: "from-amber-500 to-orange-400",
  };

  return (
    <Card className="overflow-hidden">
      <div className={`mb-5 h-2 w-20 rounded-full bg-gradient-to-r ${tones[tone]}`} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
    </Card>
  );
}
