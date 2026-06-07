import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { createMedicalLog, getMedicalLogs } from "../../services/medical.service";
import { getApiError } from "../../utils/apiErrors";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function MedicalLogs() {
  const { t } = useTranslation();
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
      setError(getApiError(requestError, t("medical.errorLoading")));
      setLoading(false);
    });
  }, [t]);

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
      setSuccess(t("medical.savedSuccess"));
      await loadLogs();
    } catch (requestError) {
      setError(getApiError(requestError, t("medical.errorSaving")));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("medical.addLog")}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t("medical.postRoute")}</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <Input label={t("medical.title")} name="title" value={form.title} onChange={updateField} placeholder={t("medical.titlePlaceholder")} required />
          <Input label={t("glucose.loggedAt")} name="logged_at" type="datetime-local" value={form.logged_at} onChange={updateField} required />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("medical.description")}</span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-900/50"
              placeholder={t("medical.descriptionPlaceholder")}
              required
            />
          </label>
          <Button className="w-full" disabled={saving}>{saving ? t("medical.saving") : t("medical.saveLog")}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("medical.medicalLogs")}</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{t("medical.fetchRoute")}</p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">{logs.length} {t("medical.logs")}</span>
        </div>
        <div className="space-y-3">
          {loading && <p className="text-slate-500 dark:text-slate-400">{t("medical.loadingLogs")}</p>}
          {!loading && logs.map((log) => (
            <div key={log.id || `${log.created_at}-${log.title}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">{log.title || log.type || t("dashboard.medicalNote")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{formatDate(log.logged_at || log.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{log.description || log.notes || log.note || t("dashboard.noDescription")}</p>
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500 dark:bg-slate-700 dark:text-slate-400">{t("medical.noLogs")}</p>}
        </div>
      </Card>
    </div>
  );
}
