import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { getGlucoseLogs } from "../../services/glucose.service";
import { getMedicalLogs } from "../../services/medical.service";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function Dashboard() {
  const [glucoseLogs, setGlucoseLogs] = useState([]);
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [glucoseResponse, medicalResponse] = await Promise.all([
          getGlucoseLogs(),
          getMedicalLogs(),
        ]);

        setGlucoseLogs(unwrapCollection(glucoseResponse.data));
        setMedicalLogs(unwrapCollection(medicalResponse.data));
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const latestGlucose = glucoseLogs[0];
  const averageGlucose = glucoseLogs.length
    ? Math.round(glucoseLogs.reduce((total, log) => total + Number(log.glucose_amount || log.amount || 0), 0) / glucoseLogs.length)
    : "—";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-cyan-500 p-8 text-white shadow-2xl shadow-sky-600/20">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-100">Overview</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight">Keep today’s glucose readings and medical notes in sync.</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/glucose" variant="secondary">Add glucose</Button>
          <Button as={Link} to="/medical" variant="secondary">Add medical note</Button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <StatCard label="Latest glucose" value={latestGlucose ? `${latestGlucose.glucose_amount || latestGlucose.amount} mg/dL` : "—"} hint={latestGlucose ? formatDate(latestGlucose.logged_at || latestGlucose.created_at) : "No readings yet"} />
        <StatCard label="Average glucose" value={averageGlucose === "—" ? "—" : `${averageGlucose} mg/dL`} hint={`${glucoseLogs.length} total readings`} tone="emerald" />
        <StatCard label="Medical logs" value={medicalLogs.length} hint="Total notes saved" tone="violet" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">Recent glucose</h3>
            <Link to="/glucose" className="text-sm font-bold text-sky-600">View all</Link>
          </div>
          <div className="space-y-3">
            {loading && <p className="text-slate-500">Loading readings...</p>}
            {!loading && glucoseLogs.slice(0, 5).map((log) => (
              <div key={log.id || `${log.logged_at}-${log.glucose_amount}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-bold text-slate-950">{log.glucose_amount || log.amount} mg/dL</span>
                <span className="text-sm text-slate-500">{formatDate(log.logged_at || log.created_at)}</span>
              </div>
            ))}
            {!loading && glucoseLogs.length === 0 && <p className="text-slate-500">No glucose readings yet.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">Recent medical logs</h3>
            <Link to="/medical" className="text-sm font-bold text-sky-600">View all</Link>
          </div>
          <div className="space-y-3">
            {loading && <p className="text-slate-500">Loading notes...</p>}
            {!loading && medicalLogs.slice(0, 5).map((log) => (
              <div key={log.id || `${log.created_at}-${log.title}`} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-950">{log.title || log.type || "Medical note"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{log.description || log.notes || log.note || "No description"}</p>
              </div>
            ))}
            {!loading && medicalLogs.length === 0 && <p className="text-slate-500">No medical logs yet.</p>}
          </div>
        </Card>
      </section>
    </div>
  );
}
