import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import { createGlucoseLog, getGlucoseLogs } from "../../services/glucose.service";
import { createMedicalLog, getMedicalLogs } from "../../services/medical.service";
import { formatDate, unwrapCollection } from "../../utils/data";
import { useAuthStore } from "../../store/auth.store";

const FILTER_OPTIONS = [
  { key: "3h", hours: 3 },
  { key: "12h", hours: 12 },
  { key: "24h", hours: 24 },
  { key: "7d", hours: 24 * 7 },
];

function getStatusFromAverage(value) {
  if (!value || Number.isNaN(value)) {
    return { label: "No Data", color: "slate", rating: "—" };
  }

  if (value < 80) {
    return { label: "Low Trend", color: "amber", rating: "C" };
  }

  if (value <= 140) {
    return { label: "In Range", color: "emerald", rating: "A" };
  }

  if (value <= 180) {
    return { label: "Elevated", color: "orange", rating: "B" };
  }

  return { label: "High Risk", color: "rose", rating: "D" };
}

function getChartPath(points, width, height, minY, maxY) {
  if (!points.length) {
    return "";
  }

  const spread = maxY - minY || 1;
  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.value - minY) / spread) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [glucoseLogs, setGlucoseLogs] = useState([]);
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [quickForm, setQuickForm] = useState({ glucose_amount: "", note: "" });
  const [filterKey, setFilterKey] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMobileQuickAdd, setShowMobileQuickAdd] = useState(true);

  async function loadDashboard() {
    const [glucoseResponse, medicalResponse] = await Promise.all([
      getGlucoseLogs(),
      getMedicalLogs(),
    ]);

    setGlucoseLogs(unwrapCollection(glucoseResponse.data));
    setMedicalLogs(unwrapCollection(medicalResponse.data));
  }

  useEffect(() => {
    loadDashboard()
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, []);

  const latestGlucose = glucoseLogs[0];
  const recentSevenDays = useMemo(() => {
    const start = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return glucoseLogs.filter((log) => new Date(log.logged_at || log.created_at).getTime() >= start);
  }, [glucoseLogs]);

  const averageGlucose = recentSevenDays.length
    ? Math.round(recentSevenDays.reduce((total, log) => total + Number(log.glucose_amount || log.amount || 0), 0) / recentSevenDays.length)
    : null;

  const healthStatus = getStatusFromAverage(averageGlucose);

  const filteredChartLogs = useMemo(() => {
    const option = FILTER_OPTIONS.find((item) => item.key === filterKey) || FILTER_OPTIONS[2];
    const from = Date.now() - option.hours * 60 * 60 * 1000;

    const filtered = glucoseLogs.filter((log) => {
      const timestamp = new Date(log.logged_at || log.created_at).getTime();
      return Number.isFinite(timestamp) && timestamp >= from;
    });

    return filtered.sort(
      (left, right) => new Date(left.logged_at || left.created_at).getTime() - new Date(right.logged_at || right.created_at).getTime(),
    );
  }, [filterKey, glucoseLogs]);

  const chartPoints = filteredChartLogs.map((log) => ({
    value: Number(log.glucose_amount || log.amount || 0),
    label: formatDate(log.logged_at || log.created_at),
  }));

  const chartMin = Math.min(...chartPoints.map((point) => point.value), 60);
  const chartMax = Math.max(...chartPoints.map((point) => point.value), 220);
  const chartPath = getChartPath(chartPoints, 100, 46, chartMin, chartMax);

  const mergedHistory = useMemo(() => {
    const glucoseItems = glucoseLogs.map((log) => ({
      id: `g-${log.id || `${log.logged_at}-${log.glucose_amount}`}`,
      type: "glucose",
      timestamp: log.logged_at || log.created_at,
      title: `${log.glucose_amount || log.amount} mg/dL`,
      detail: log.note || log.notes || "",
    }));

    const noteItems = medicalLogs.map((log) => ({
      id: `m-${log.id || `${log.created_at}-${log.type || "medical"}`}`,
      type: "note",
      timestamp: log.logged_at || log.created_at,
      title: log.type || t("dashboard.medicalNote"),
      detail: log.note || t("dashboard.noDescription"),
    }));

    return [...glucoseItems, ...noteItems]
      .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
      .slice(0, 10);
  }, [glucoseLogs, medicalLogs, t]);

  async function submitQuickAdd(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const glucoseValue = Number(quickForm.glucose_amount);
    const hasGlucose = Number.isFinite(glucoseValue) && glucoseValue > 0;
    const hasNote = Boolean(quickForm.note.trim());

    if (!hasGlucose && !hasNote) {
      setError("Enter a glucose value or a short note.");
      setSaving(false);
      return;
    }

    try {
      const requests = [];

      if (hasGlucose) {
        requests.push(
          createGlucoseLog({
            glucose_amount: glucoseValue,
            logged_at: new Date().toISOString(),
            note: hasNote ? quickForm.note.trim() : "",
          }),
        );
      }

      if (hasNote) {
        requests.push(
          createMedicalLog({
            amount: 0,
            type: "quick-note",
            note: quickForm.note.trim(),
            logged_at: new Date().toISOString(),
          }),
        );
      }

      await Promise.all(requests);
      await loadDashboard();
      setQuickForm({ glucose_amount: "", note: "" });
      setSuccess("Saved successfully.");
    } catch {
      setError("Unable to save quick entry.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    function onScroll() {
      setShowMobileQuickAdd(window.scrollY < 220);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const statusColors = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
  };

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.6fr_0.9fr]">
      <div className="space-y-6">
        <Card className="p-0">
          <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("dashboard.overview")}</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Glucose Trend</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilterKey(option.key)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      filterKey === option.key
                        ? "bg-sky-600 text-white dark:bg-sky-500"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    aria-pressed={filterKey === option.key}
                  >
                    {option.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Latest Reading</p>
                <p className="text-3xl font-black text-slate-950 dark:text-white">{latestGlucose ? `${latestGlucose.glucose_amount || latestGlucose.amount} mg/dL` : "—"}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {latestGlucose ? formatDate(latestGlucose.logged_at || latestGlucose.created_at) : t("dashboard.noReadingsYet")}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
              <svg viewBox="0 0 100 46" className="h-40 w-full sm:h-52" role="img" aria-label="Glucose chart">
                <rect x="0" y="0" width="100" height="46" fill="transparent" />
                <line x1="0" y1="33" x2="100" y2="33" stroke="currentColor" className="text-emerald-300/50 dark:text-emerald-500/40" strokeWidth="0.5" />
                <path d={chartPath} fill="none" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
                {chartPoints.map((point, index) => {
                  const spread = chartMax - chartMin || 1;
                  const x = (index / Math.max(chartPoints.length - 1, 1)) * 100;
                  const y = 46 - ((point.value - chartMin) / spread) * 46;
                  return (
                    <circle
                      key={`${point.label}-${index}`}
                      cx={x}
                      cy={y}
                      r="1.4"
                      fill="currentColor"
                      className="text-sky-500 dark:text-sky-300"
                    />
                  );
                })}
              </svg>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Target range highlighted at ~80–140 mg/dL. {chartPoints.length} points shown.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">Contextual History</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {mergedHistory.length} recent
            </span>
          </div>
          <div className="space-y-3">
            {loading && (
              <>
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
              </>
            )}
            {!loading && mergedHistory.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-slate-950 dark:text-white">{item.title}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.type === "glucose" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300" : "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300"}`}>
                    {item.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(item.timestamp)}</p>
                {item.detail && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>}
              </div>
            ))}
            {!loading && mergedHistory.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t("dashboard.noMedicalLogs")}</p>}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card id="quick-add-panel" className="xl:sticky xl:top-24">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Quick Add</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fast logging with minimal fields.</p>
          <form onSubmit={submitQuickAdd} className="mt-5 space-y-4">
            <Alert>{error}</Alert>
            <Alert type="success">{success}</Alert>
            <Input
              label={t("glucose.glucoseAmount")}
              name="glucose_amount"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="120"
              value={quickForm.glucose_amount}
              onChange={(event) => setQuickForm((state) => ({ ...state, glucose_amount: event.target.value }))}
              className="text-lg"
            />
            <Input
              label={t("glucose.notes")}
              name="note"
              value={quickForm.note}
              onChange={(event) => setQuickForm((state) => ({ ...state, note: event.target.value }))}
              placeholder={t("glucose.notesPlaceholder")}
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 active:scale-[0.99] hover:bg-sky-700 disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              {saving ? t("common.loading") : "Save Quick Log"}
            </button>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Health Snapshot</h3>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">7-day Avg</p>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{averageGlucose ? `${averageGlucose} mg/dL` : "—"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${statusColors[healthStatus.color]}`}>
                {healthStatus.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">Rating</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{healthStatus.rating}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">Highs</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{recentSevenDays.filter((log) => Number(log.glucose_amount || log.amount || 0) > 180).length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-400">Lows</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{recentSevenDays.filter((log) => Number(log.glucose_amount || log.amount || 0) < 80).length}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">Profile</h3>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="text-lg font-bold text-slate-950 dark:text-white">{user?.name || "Patient"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || "No email available"}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/60 dark:text-sky-300">Units: mg/dL</span>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">Mobile-ready</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">Fast entry mode</span>
          </div>
        </Card>
      </div>
      <a
        href="#quick-add-panel"
        className={`fixed bottom-4 right-4 z-30 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition lg:hidden ${showMobileQuickAdd ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"}`}
      >
        + Quick Add
      </a>
    </div>
  );
}
