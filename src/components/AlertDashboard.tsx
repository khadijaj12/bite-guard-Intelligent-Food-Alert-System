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

const FILTERS: FilterType[] = ["all", "critical", "warning", "watch", "resolved"];

export function AlertDashboard({ alerts, selected, onSelect, onResolve, onViewMap, filter, onFilterChange }: AlertDashboardProps) {
  const filtered = filter === "all" ? alerts : alerts.filter(a => a.level === filter || a.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => {
          const cfg = LEVEL_CONFIG[f];
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className="px-3.5 py-1.5 rounded text-[9px] tracking-[2px] uppercase transition-all duration-200"
              style={{
                border: `1px solid ${isActive ? (cfg?.color || "#fff") : "hsl(var(--border))"}`,
                background: isActive ? (cfg?.bg || "hsl(var(--muted))") : "transparent",
                color: isActive ? (cfg?.color || "hsl(var(--foreground))") : "hsl(var(--muted-foreground))",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map(alert => {
          const cfg = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.watch;
          const isSel = selected?.id === alert.id;
          return (
            <div
              key={alert.id}
              onClick={() => onSelect(isSel ? null : alert)}
              className="rounded-lg px-4 py-4 cursor-pointer transition-all duration-200 hover:brightness-110"
              style={{
                border: `1px solid ${isSel ? cfg.color : "hsl(var(--border))"}`,
                borderLeft: `4px solid ${cfg.color}`,
                background: isSel ? cfg.bg : "hsl(var(--card))",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span
                      className="text-[8px] px-2 py-0.5 rounded-sm font-bold tracking-[2px]"
                      style={{ background: cfg.color, color: "#000" }}
                    >
                      {cfg.label}
                    </span>
                    {cfg.pulse && alert.status === "active" && (
                      <span className="text-[8px] tracking-[1px]" style={{ color: cfg.color, animation: "blink 1s infinite" }}>
                        ● LIVE
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{alert.reported}</span>
                  </div>
                  <div className="text-[15px] font-bold text-foreground mb-0.5">{alert.title}</div>
                  <div className="text-[11px] text-muted-foreground">📍 {alert.location}</div>
                  {alert.product && <div className="text-[11px] text-muted-foreground/70 mt-0.5">🏷 {alert.product}</div>}
                </div>
                <div className="text-right min-w-[60px]">
                  <div className="text-2xl font-bold" style={{ color: cfg.color }}>{alert.reports}</div>
                  <div className="text-[9px] text-muted-foreground tracking-[1px]">REPORTS</div>
                </div>
              </div>

              {isSel && (
                <div
                  className="mt-3.5 pt-3.5"
                  style={{ borderTop: `1px solid ${cfg.color}33`, animation: "slide-in 0.2s ease" }}
                >
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{alert.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {alert.status !== "resolved" && (
                      <button
                        onClick={e => { e.stopPropagation(); onResolve(alert.id); }}
                        className="px-4 py-1.5 bg-accent text-accent-foreground rounded text-[9px] tracking-[2px] font-bold hover:opacity-80 transition-opacity"
                      >
                        ✓ MARK RESOLVED
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); onViewMap(); }}
                      className="px-4 py-1.5 rounded text-[9px] tracking-[2px] bg-transparent hover:opacity-80 transition-opacity"
                      style={{ border: `1px solid ${cfg.color}`, color: cfg.color }}
                    >
                      ◎ VIEW ON MAP
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-xs tracking-[2px]">
            NO ALERTS MATCH THIS FILTER
          </div>
        )}
      </div>
    </div>
  );
}
