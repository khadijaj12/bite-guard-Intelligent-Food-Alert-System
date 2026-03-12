import { Alert, LEVEL_CONFIG } from "@/lib/alertData";
import { FilterType } from "@/lib/alertData";

interface AlertDashboardProps {
  alerts: Alert[];
  selected: Alert | null;
  onSelect: (alert: Alert | null) => void;
  onResolve: (id: number) => void;
  onViewMap: () => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
}

const FILTER_LABELS: Record<FilterType, string> = {
  all: "All",
  critical: "Critical",
  warning: "Warning",
  watch: "Watch",
  resolved: "Resolved",
};

const FILTERS: FilterType[] = ["all", "critical", "warning", "watch", "resolved"];

export function AlertDashboard({ alerts, selected, onSelect, onResolve, onViewMap, filter, onFilterChange }: AlertDashboardProps) {
  const filtered = filter === "all" ? alerts : alerts.filter(a => a.level === filter || a.status === filter);

  return (
    <div>
      {/* Section heading */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground mb-1">Food Safety Alerts</h2>
        <p className="text-sm text-muted-foreground">Monitor active food safety incidents across Lahore</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => {
          const cfg = LEVEL_CONFIG[f];
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className="px-4 py-2 rounded-lg text-xs tracking-wide transition-all duration-200 font-medium"
              style={{
                border: `1px solid ${isActive ? (cfg?.color || "hsl(var(--foreground))") : "hsl(var(--border))"}`,
                background: isActive ? (cfg?.bg || "hsl(var(--muted))") : "transparent",
                color: isActive ? (cfg?.color || "hsl(var(--foreground))") : "hsl(var(--muted-foreground))",
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3">
        {filtered.map(alert => {
          const cfg = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.watch;
          const isSel = selected?.id === alert.id;
          return (
            <div
              key={alert.id}
              onClick={() => onSelect(isSel ? null : alert)}
              className="rounded-xl px-4 sm:px-5 py-4 cursor-pointer transition-all duration-200 hover:brightness-110 group"
              style={{
                border: `1px solid ${isSel ? cfg.color : "hsl(var(--border))"}`,
                borderLeft: `4px solid ${cfg.color}`,
                background: isSel ? cfg.bg : "hsl(var(--card))",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded font-bold tracking-wider"
                      style={{ background: cfg.color, color: "#000" }}
                    >
                      {cfg.label}
                    </span>
                    {cfg.pulse && alert.status === "active" && (
                      <span className="text-[10px] tracking-wide font-medium" style={{ color: cfg.color, animation: "blink 1s infinite" }}>
                        ● LIVE
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{alert.reported}</span>
                  </div>
                  <div className="text-base font-bold text-foreground mb-1">{alert.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>📍</span> {alert.location}
                  </div>
                  {alert.product && (
                    <div className="text-sm text-muted-foreground/70 mt-1 flex items-center gap-1">
                      <span>🏷</span> {alert.product}
                    </div>
                  )}
                </div>
                <div className="text-right min-w-[60px] flex-shrink-0">
                  <div className="text-2xl font-bold" style={{ color: cfg.color }}>{alert.reports}</div>
                  <div className="text-[10px] text-muted-foreground tracking-wide">reports</div>
                </div>
              </div>

              {isSel && (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: `1px solid ${cfg.color}33`, animation: "slide-in 0.2s ease" }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{alert.description}</p>
                  <div className="flex gap-3 flex-wrap">
                    {alert.status !== "resolved" && (
                      <button
                        onClick={e => { e.stopPropagation(); onResolve(alert.id); }}
                        className="px-5 py-2.5 bg-accent text-accent-foreground rounded-lg text-xs tracking-wide font-bold hover:opacity-80 transition-opacity"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); onViewMap(); }}
                      className="px-5 py-2.5 rounded-lg text-xs tracking-wide bg-transparent hover:opacity-80 transition-opacity font-medium"
                      style={{ border: `1px solid ${cfg.color}`, color: cfg.color }}
                    >
                      🗺️ View on Map
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-xl border border-border bg-card">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-muted-foreground text-sm font-medium">No alerts match this filter</div>
            <p className="text-muted-foreground/60 text-xs mt-1">Try selecting a different category above</p>
          </div>
        )}
      </div>
    </div>
  );
}
