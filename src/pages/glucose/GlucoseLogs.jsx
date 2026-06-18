import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { createGlucoseLog, getGlucoseLogs } from "../../services/glucose.service";
import { getFieldErrors, getStatusMessage } from "../../utils/apiErrors";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function GlucoseLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ glucose_amount: "", logged_at: new Date().toISOString().slice(0, 16), note: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function loadLogs() {
    setLoading(true);
    const response = await getGlucoseLogs();
    setLogs(unwrapCollection(response.data));
    setLoading(false);
  }

  useEffect(() => {
    loadLogs().catch((requestError) => {
      setError(getStatusMessage(requestError, t("glucose.errorLoading")));
      setLoading(false);
    });
  }, [t]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      await createGlucoseLog({
        ...form,
        glucose_amount: Number(form.glucose_amount),
      });
      setForm({ glucose_amount: "", logged_at: new Date().toISOString().slice(0, 16), note: "" });
      setSuccess(t("glucose.savedSuccess"));
      await loadLogs();
    } catch (requestError) {
      if (requestError?.response?.status === 422) {
        setFieldErrors(getFieldErrors(requestError));
      } else {
        setError(getStatusMessage(requestError, t("glucose.errorSaving")));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("glucose.addReading")}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t("glucose.postRoute")}</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <Input label={t("glucose.glucoseAmount")} name="glucose_amount" type="number" value={form.glucose_amount} onChange={updateField} placeholder="120" required min="1" error={fieldErrors.glucose_amount} />
          <Input label={t("glucose.loggedAt")} name="logged_at" type="datetime-local" value={form.logged_at} onChange={updateField} required error={fieldErrors.logged_at} />
          <Input label={t("glucose.notes")} name="note" value={form.note} onChange={updateField} placeholder={t("glucose.notesPlaceholder")} error={fieldErrors.note} />
          <Button className="w-full" disabled={saving}>{saving ? t("glucose.saving") : t("glucose.saveReading")}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("glucose.glucoseLogs")}</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{t("glucose.fetchRoute")}</p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-300">{logs.length} {t("glucose.logs")}</span>
        </div>
        <div className="space-y-3">
          {loading && (
            <>
              <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
              <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
              <div className="h-24 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700/60" />
            </>
          )}
          {!loading && logs.map((log) => (
            <div key={log.id || `${log.logged_at}-${log.glucose_amount}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-black text-slate-950 dark:text-white">{log.glucose_amount || log.amount} mg/dL</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{formatDate(log.logged_at || log.created_at)}</p>
              </div>
              {(log.note || log.notes) && <p className="mt-3 text-slate-600 dark:text-slate-300">{log.note || log.notes}</p>}
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500 dark:bg-slate-700 dark:text-slate-400">{t("glucose.noLogs")}</p>}
        </div>
      </Card>
    </div>
  );
}
