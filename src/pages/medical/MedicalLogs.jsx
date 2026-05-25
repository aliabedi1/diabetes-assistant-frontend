import { useEffect, useState } from "react";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { createMedicalLog, getMedicalLogs } from "../../services/medical.service";
import { getApiError } from "../../utils/apiErrors";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function MedicalLogs() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", logged_at: new Date().toISOString().slice(0, 16) });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadLogs() {
    setLoading(true);
    const response = await getMedicalLogs();
    setLogs(unwrapCollection(response.data));
    setLoading(false);
  }

  useEffect(() => {
    loadLogs().catch((requestError) => {
      setError(getApiError(requestError, "Unable to load medical logs."));
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
      await createMedicalLog(form);
      setForm({ title: "", description: "", logged_at: new Date().toISOString().slice(0, 16) });
      setSuccess("Medical log saved.");
      await loadLogs();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save medical log."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-black text-slate-950">Add medical log</h2>
        <p className="mt-2 text-slate-500">Posts to Laravel route POST /api/medical/logs.</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <Input label="Title" name="title" value={form.title} onChange={updateField} placeholder="Medication, appointment, symptom..." required />
          <Input label="Logged at" name="logged_at" type="datetime-local" value={form.logged_at} onChange={updateField} required />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Write notes for this medical event..."
              required
            />
          </label>
          <Button className="w-full" disabled={saving}>{saving ? "Saving..." : "Save medical log"}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Medical logs</h2>
            <p className="mt-1 text-slate-500">Fetched from GET /api/medical/logs.</p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">{logs.length} logs</span>
        </div>
        <div className="space-y-3">
          {loading && <p className="text-slate-500">Loading medical logs...</p>}
          {!loading && logs.map((log) => (
            <div key={log.id || `${log.created_at}-${log.title}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-slate-950">{log.title || log.type || "Medical note"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{formatDate(log.logged_at || log.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 text-slate-600">{log.description || log.notes || log.note || "No description"}</p>
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">No medical logs yet.</p>}
        </div>
      </Card>
    </div>
  );
}
