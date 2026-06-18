import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { createMedicalLog, getMedicalLogs } from "../../services/medical.service";
import { getFieldErrors, getStatusMessage } from "../../utils/apiErrors";
import { formatDate, unwrapCollection } from "../../utils/data";

export default function MedicalLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ amount: "", type: "", note: "", logged_at: new Date().toISOString().slice(0, 16) });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function loadLogs() {
    setLoading(true);
    const response = await getMedicalLogs();
    setLogs(unwrapCollection(response.data));
    setLoading(false);
  }

  useEffect(() => {
    loadLogs().catch((requestError) => {
      setError(getStatusMessage(requestError, t("medical.errorLoading")));
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
      await createMedicalLog({
        ...form,
        amount: Number(form.amount),
      });
      setForm({ amount: "", type: "", note: "", logged_at: new Date().toISOString().slice(0, 16) });
      setSuccess(t("medical.savedSuccess"));
      await loadLogs();
    } catch (requestError) {
      if (requestError?.response?.status === 422) {
        setFieldErrors(getFieldErrors(requestError));
      } else {
        setError(getStatusMessage(requestError, t("medical.errorSaving")));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("medical.addLog")}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t("medical.postRoute")}</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <Input label={t("medical.amount") || "Amount"} name="amount" type="number" value={form.amount} onChange={updateField} placeholder="8.5" required min="0" step="0.01" error={fieldErrors.amount} />
          <Input label={t("medical.type") || "Type"} name="type" value={form.type} onChange={updateField} placeholder={t("medical.typePlaceholder") || "e.g., insulin"} error={fieldErrors.type} />
          <Input label={t("glucose.loggedAt")} name="logged_at" type="datetime-local" value={form.logged_at} onChange={updateField} required error={fieldErrors.logged_at} />
          <Input label={t("medical.note") || t("glucose.notes")} name="note" value={form.note} onChange={updateField} placeholder={t("medical.notePlaceholder") || t("medical.descriptionPlaceholder")} error={fieldErrors.note} />
          <Button className="w-full" disabled={saving}>{saving ? t("medical.saving") : t("medical.saveLog")}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("medical.medicalLogs")}</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{t("medical.fetchRoute")}</p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">{logs.length} {t("medical.logs")}</span>
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
            <div key={log.id || `${log.created_at}-${log.type}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">{log.type || t("dashboard.medicalNote")}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{formatDate(log.logged_at || log.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{log.note || t("dashboard.noDescription")}</p>
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500 dark:bg-slate-700 dark:text-slate-400">{t("medical.noLogs")}</p>}
        </div>
      </Card>
    </div>
  );
}
