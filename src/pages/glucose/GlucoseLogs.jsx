import { useEffect, useState } from "react";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { createGlucoseLog, getGlucoseLogs } from "../../services/glucose.service";
import { getApiError } from "../../utils/apiErrors";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function GlucoseLogs() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ glucose_amount: "", logged_at: new Date().toISOString().slice(0, 16), notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadLogs() {
    setLoading(true);
    const response = await getGlucoseLogs();
    setLogs(unwrapCollection(response.data));
    setLoading(false);
  }

  useEffect(() => {
    loadLogs().catch((requestError) => {
      setError(getApiError(requestError, "Unable to load glucose logs."));
      setLoading(false);
    });
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createGlucoseLog({
        ...form,
        glucose_amount: Number(form.glucose_amount),
      });
      setForm({ glucose_amount: "", logged_at: new Date().toISOString().slice(0, 16), notes: "" });
      setSuccess("Glucose reading saved.");
      await loadLogs();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save glucose reading."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-black text-slate-950">Add glucose reading</h2>
        <p className="mt-2 text-slate-500">Posts to Laravel route POST /api/glucose/logs.</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <Input label="Glucose amount" name="glucose_amount" type="number" value={form.glucose_amount} onChange={updateField} placeholder="120" required min="1" />
          <Input label="Logged at" name="logged_at" type="datetime-local" value={form.logged_at} onChange={updateField} required />
          <Input label="Notes" name="notes" value={form.notes} onChange={updateField} placeholder="Before breakfast, after walk..." />
          <Button className="w-full" disabled={saving}>{saving ? "Saving..." : "Save reading"}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Glucose logs</h2>
            <p className="mt-1 text-slate-500">Fetched from GET /api/glucose/logs.</p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700">{logs.length} logs</span>
        </div>
        <div className="space-y-3">
          {loading && <p className="text-slate-500">Loading glucose logs...</p>}
          {!loading && logs.map((log) => (
            <div key={log.id || `${log.logged_at}-${log.glucose_amount}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-black text-slate-950">{log.glucose_amount || log.amount} mg/dL</p>
                <p className="text-sm font-semibold text-slate-500">{formatDate(log.logged_at || log.created_at)}</p>
              </div>
              {(log.notes || log.note) && <p className="mt-3 text-slate-600">{log.notes || log.note}</p>}
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">No glucose logs yet.</p>}
        </div>
      </Card>
    </div>
  );
}
