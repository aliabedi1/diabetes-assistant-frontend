import { Link } from "react-router-dom";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-5%] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_460px]">
        <section>
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600">D</span>
            Diabetes Assistant
          </Link>
          <h1 className="mt-12 max-w-2xl text-5xl font-black tracking-tight lg:text-6xl">
            Better daily diabetes tracking, beautifully organized.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Connect to your Laravel Sanctum API, record glucose readings, and keep medical notes in one calm dashboard.
          </p>
        </section>
        <section className="rounded-[2rem] border border-white/10 bg-white p-8 text-slate-950 shadow-2xl shadow-black/30">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
