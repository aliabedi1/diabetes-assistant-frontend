import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>
      <section className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-lg font-black">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600">D</span>
            Diabetes Assistant
          </Link>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Login</Link>
            <Link to="/register" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">Start free</Link>
          </div>
        </nav>
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
              Laravel Sanctum + React + Tailwind
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              A modern diabetes companion for daily health logs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track glucose readings, store medical notes, and keep your health data organized through your Laravel API.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button as={Link} to="/register">Get started</Button>
              <Button as={Link} to="/login" variant="secondary">Open dashboard</Button>
            </div>
          </div>
          <Card className="bg-white/95 text-slate-950">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Today</p>
                <h2 className="text-2xl font-black">Health summary</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">Synced</span>
            </div>
            <div className="space-y-4">
              {[
                ["Glucose", "112 mg/dL", "Stable range"],
                ["Medical logs", "3 notes", "This week"],
                ["Last check-in", "8:30 AM", "Morning reading"],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
