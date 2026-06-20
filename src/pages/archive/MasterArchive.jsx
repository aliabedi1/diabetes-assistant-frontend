import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Card from "../../components/ui/Card";
import { getGlucoseLogs } from "../../services/glucose.service";
import { getMedicalLogs } from "../../services/medical.service";
import { formatDate, unwrapCollection } from "../../utils/data";
import { getStatusMessage } from "../../utils/apiErrors";

const PAGE_SIZE = 12;

export default function MasterArchive() {
  const { t } = useTranslation();
  const [entity, setEntity] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [glucoseLogs, setGlucoseLogs] = useState([]);
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const entityOptions = [
    { key: "all", label: t("archive.filterAll") },
    { key: "glucose", label: t("archive.filterGlucose") },
    { key: "notes", label: t("archive.filterNotes") },
    { key: "reports", label: t("archive.filterReports") },
  ];

  const typeLabels = {
    glucose: t("archive.typeGlucose"),
    notes: t("archive.typeNotes"),
    reports: t("archive.typeReports"),
  };

  useEffect(() => {
    async function loadEntries() {
      const [glucoseResponse, medicalResponse] = await Promise.all([
        getGlucoseLogs(),
        getMedicalLogs(),
      ]);

      setGlucoseLogs(unwrapCollection(glucoseResponse.data));
      setMedicalLogs(unwrapCollection(medicalResponse.data));
    }

    loadEntries()
      .catch((requestError) => setError(getStatusMessage(requestError, t("archive.errorLoading"))))
      .finally(() => setLoading(false));
  }, [t]);

  const archiveItems = useMemo(() => {
    const glucoseItems = glucoseLogs.map((log) => ({
      id: `g-${log.id || `${log.logged_at}-${log.glucose_amount}`}`,
      type: "glucose",
      title: `${log.glucose_amount || log.amount} mg/dL`,
      detail: log.note || log.notes || "",
      date: log.logged_at || log.created_at,
    }));

    const noteItems = medicalLogs.map((log) => ({
      id: `m-${log.id || `${log.created_at}-${log.type || "medical"}`}`,
      type: (log.type || "").toLowerCase().includes("report") ? "reports" : "notes",
      title: log.type || t("dashboard.medicalNote"),
      detail: log.note || t("dashboard.noDescription"),
      date: log.logged_at || log.created_at,
    }));

    return [...glucoseItems, ...noteItems]
      .filter((item) => (entity === "all" ? true : item.type === entity))
      .filter((item) => {
        if (!query.trim()) {
          return true;
        }

        const haystack = `${item.title} ${item.detail}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      })
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  }, [entity, query, glucoseLogs, medicalLogs, t]);

  const visibleItems = archiveItems.slice(0, visibleCount);
  const canLoadMore = visibleItems.length < archiveItems.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [entity, query]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t("archive.title")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("archive.subtitle")}</p>
          </div>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {t("archive.showingOf", { visible: visibleItems.length, total: archiveItems.length })}
          </p>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {entityOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setEntity(option.key)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                entity === option.key
                  ? "bg-sky-600 text-white dark:bg-sky-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
              aria-pressed={entity === option.key}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("archive.searchPlaceholder")}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-900/50"
          />
        </div>
      </Card>

      <Card>
        <Alert>{error}</Alert>
        {loading && (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
          </div>
        )}
        {!loading && visibleItems.length === 0 && !error && (
          <p className="text-slate-500 dark:text-slate-400">{t("archive.noRecords")}</p>
        )}
        <div className="space-y-3">
          {!loading && visibleItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.type === "glucose"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300"
                    : item.type === "notes"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                }`}>
                  {typeLabels[item.type] || item.type}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDate(item.date)}</p>
            </div>
          ))}
        </div>

        {canLoadMore && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {t("archive.loadMore")}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
