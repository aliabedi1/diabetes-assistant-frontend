import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMedicines, getRecentMedicines } from "../../services/medicine.service";
import { unwrapCollection } from "../../utils/data";

const CLS_BASE = "w-full rounded-2xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-500 focus:ring-4 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";
const CLS_NORMAL = "border-slate-300 focus:border-sky-500 focus:ring-sky-100 dark:border-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-900/50";
const CLS_ERROR = "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-900/40";

function FieldErrors({ error }) {
  if (!error) return null;
  const msgs = Array.isArray(error) ? error : [error];
  return (
    <div className="mt-2 space-y-1">
      {msgs.map((msg, i) => (
        <span key={i} className="block text-sm text-rose-600 dark:text-rose-400">{msg}</span>
      ))}
    </div>
  );
}

// Renders both name variants with the Persian one in its own dir="rtl" span.
function MedicineLabel({ name_en, name_fa }) {
  if (name_en && name_fa) {
    return (
      <>
        {name_en}
        <span className="text-slate-400 dark:text-slate-500"> / </span>
        <span dir="rtl">{name_fa}</span>
      </>
    );
  }
  return <>{name_en || name_fa}</>;
}

export default function MedicineField({ label, value, onChange, error }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch medicine lists on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getMedicines(), getRecentMedicines()])
      .then(([medRes, recentRes]) => {
        if (cancelled) return;
        setMedicines(unwrapCollection(medRes.data));
        setRecent(unwrapCollection(recentRes.data).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Close on outside click
  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const globalMedicines = medicines.filter((m) => m.is_global);

  const filtered = query.trim()
    ? medicines.filter((m) => {
        const q = query.toLowerCase();
        return m.name_en?.toLowerCase().includes(q) || m.name_fa?.includes(query);
      })
    : [];

  const hasExactMatch = filtered.some(
    (m) =>
      m.name_en?.toLowerCase() === query.trim().toLowerCase() ||
      m.name_fa === query.trim()
  );

  // Flat list used for arrow-key navigation
  const navItems = query.trim()
    ? [
        ...filtered.map((m) => ({ kind: "medicine", ...m })),
        ...(!hasExactMatch ? [{ kind: "create" }] : []),
      ]
    : globalMedicines.map((m) => ({ kind: "medicine", ...m }));

  function selectMedicine(m) {
    onChange({ type: "existing", id: m.id, name_en: m.name_en, name_fa: m.name_fa });
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function confirmCreate() {
    const name = query.trim();
    if (!name) return;
    onChange({ type: "new", name });
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function clearSelection() {
    onChange(null);
    setQuery("");
    setActiveIndex(-1);
    // Re-focus so the user can immediately type a new search
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleInputChange(e) {
    const next = e.target.value;
    setQuery(next);
    if (value) onChange(null);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, navItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < navItems.length) {
          const item = navItems[activeIndex];
          item.kind === "create" ? confirmCreate() : selectMedicine(item);
        } else if (query.trim() && !filtered.length) {
          confirmCreate();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  }

  // The name to display in the input when a medicine is selected
  const selectedDisplayName = value
    ? value.type === "existing"
      ? (i18n.language === "fa" ? (value.name_fa || value.name_en) : (value.name_en || value.name_fa))
      : value.name
    : null;

  const inputValue = selectedDisplayName ?? query;

  // --- Fallback: API unavailable ---
  if (fetchError) {
    return (
      <div>
        {label && <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value.trim() ? { type: "new", name: e.target.value.trim() } : null);
          }}
          placeholder={t("medical.medicinePlaceholder")}
          className={`${CLS_BASE} ${error ? CLS_ERROR : CLS_NORMAL}`}
        />
        <FieldErrors error={error} />
      </div>
    );
  }

  // --- Container ring classes ---
  const ringCls = isOpen
    ? "border-sky-500 ring-4 ring-sky-100 dark:border-sky-400 dark:ring-sky-900/50"
    : error
    ? "border-rose-400 dark:border-rose-500"
    : "border-slate-300 dark:border-slate-500";

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}

      {/* ── Input bar ─────────────────────────────────────────────── */}
      <div className={`flex items-center rounded-2xl border bg-white transition dark:bg-slate-800 ${ringCls}`}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("medical.medicinePlaceholder")}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            aria-label={t("medical.clearMedicine")}
            className="flex shrink-0 items-center justify-center rounded-e-2xl px-3 py-3 text-xl leading-none text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Dropdown ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30"
        >
          {loading ? (
            /* Skeleton chips */
            <div className="flex flex-wrap gap-2 p-3">
              {[64, 80, 56, 96, 72].map((w, i) => (
                <div
                  key={i}
                  style={{ width: `${w}px` }}
                  className="h-7 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : query.trim() ? (
            /* ── Filtered / typing state ── */
            <>
              {filtered.map((m, i) => (
                <div
                  key={m.id}
                  role="option"
                  aria-selected={activeIndex === i}
                  onMouseDown={(e) => { e.preventDefault(); selectMedicine(m); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 ${activeIndex === i ? "bg-sky-50 dark:bg-sky-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                >
                  <MedicineLabel name_en={m.name_en} name_fa={m.name_fa} />
                  {m.is_global && (
                    <span className="ms-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      {t("medical.global")}
                    </span>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">
                  {t("medical.noResults")}
                </p>
              )}
              {!hasExactMatch && (
                <div
                  role="option"
                  aria-selected={activeIndex === filtered.length}
                  onMouseDown={(e) => { e.preventDefault(); confirmCreate(); }}
                  onMouseEnter={() => setActiveIndex(filtered.length)}
                  className={`flex cursor-pointer items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-sky-600 dark:border-slate-700 dark:text-sky-400 ${activeIndex === filtered.length ? "bg-sky-50 dark:bg-sky-900/30" : "hover:bg-sky-50/60 dark:hover:bg-sky-900/20"}`}
                >
                  <span className="text-base font-bold">+</span>
                  {t("medical.addNew", { name: query.trim() })}
                </div>
              )}
            </>
          ) : (
            /* ── Empty query: recent chips + suggested list ── */
            <div className="space-y-3 p-3">
              {recent.length > 0 && (
                <div>
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t("medical.recentlyUsed")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectMedicine(m); }}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:bg-sky-900/30 dark:hover:text-sky-300"
                      >
                        {i18n.language === "fa"
                          ? (m.name_fa || m.name_en)
                          : (m.name_en || m.name_fa)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {globalMedicines.length > 0 && (
                <div>
                  <p className="mb-1 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t("medical.suggested")}
                  </p>
                  {globalMedicines.map((m, i) => (
                    <div
                      key={m.id}
                      role="option"
                      aria-selected={activeIndex === i}
                      onMouseDown={(e) => { e.preventDefault(); selectMedicine(m); }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 ${activeIndex === i ? "bg-sky-50 dark:bg-sky-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                    >
                      <MedicineLabel name_en={m.name_en} name_fa={m.name_fa} />
                    </div>
                  ))}
                </div>
              )}

              {recent.length === 0 && globalMedicines.length === 0 && (
                <p className="px-2 py-1 text-sm text-slate-400 dark:text-slate-500">
                  {t("medical.noResults")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <FieldErrors error={error} />
    </div>
  );
}
