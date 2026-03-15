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
  all: "All Alerts",
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
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground mb-1">Food Safety Alerts</h2>
        <p className="text-sm text-muted-foreground">Stay informed about food safety incidents across Lahore. Click any alert for details.</p>
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? "shadow-sm"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
              style={isActive ? {
                borderColor: cfg?.color || "hsl(var(--primary))",
                background: cfg?.bg || "hsl(var(--primary) / 0.1)",
                color: cfg?.color || "hsl(var(--primary))",
              } : undefined}
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
              className={`rounded-xl px-4 sm:px-5 py-4 cursor-pointer transition-all duration-200 bg-card border shadow-sm hover:shadow-md ${
                isSel ? "ring-2" : ""
              }`}
              style={{
                borderLeftWidth: 4,
                borderLeftColor: cfg.color,
                ...(isSel ? { ringColor: cfg.color, background: cfg.bg } : {}),
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-white"
                      style={{ background: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    {cfg.pulse && alert.status === "active" && (
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: cfg.color, animation: "pulse-gentle 2s infinite" }}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.color }} />
                        Live
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{alert.reported}</span>
                  </div>
                  <div className="text-base font-semibold text-foreground mb-1">{alert.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    📍 {alert.location}
                  </div>
                  {alert.product && (
                    <div className="text-sm text-muted-foreground/70 mt-0.5 flex items-center gap-1.5">
                      🏷️ {alert.product}
                    </div>
                  )}
                </div>
                <div className="text-right min-w-[60px] flex-shrink-0">
                  <div className="text-2xl font-bold" style={{ color: cfg.color }}>{alert.reports}</div>
                  <div className="text-xs text-muted-foreground">reports</div>
                </div>
              </div>

              {isSel && (
                <div
                  className="mt-4 pt-4 border-t border-border"
                  style={{ animation: "fade-in 0.2s ease" }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{alert.description}</p>
                  <div className="flex gap-3 flex-wrap">
                    {alert.status !== "resolved" && (
                      <button
                        onClick={e => { e.stopPropagation(); onResolve(alert.id); }}
                        className="px-5 py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); onViewMap(); }}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
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
          <div className="text-center py-16 rounded-xl border border-border bg-card shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-foreground text-base font-semibold">No alerts found</div>
            <p className="text-muted-foreground text-sm mt-1">Try selecting a different filter above</p>
          </div>
        )}
      </div>
    </div>
  );
}
