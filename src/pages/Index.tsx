import { useState } from "react";
import { Alert, ALERTS, LEVEL_CONFIG, ViewType, FilterType } from "@/lib/alertData";
import { AlertDashboard } from "@/components/AlertDashboard";
import { MapView } from "@/components/MapView";
import { ReportForm } from "@/components/ReportForm";

const NAV_ITEMS: { key: ViewType; label: string }[] = [
  { key: "dashboard", label: "≡ Alerts" },
  { key: "map", label: "◎ Map" },
  { key: "report", label: "⚑ Report" },
];

const Index = () => {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [selected, setSelected] = useState<Alert | null>(null);
  const [view, setView] = useState<ViewType>("dashboard");
  const [filter, setFilter] = useState<FilterType>("all");
  const [notifVisible, setNotifVisible] = useState(true);

  const activeCount = alerts.filter(a => a.status === "active").length;
  const criticalCount = alerts.filter(a => a.level === "critical" && a.status === "active").length;
  const totalReports = alerts.reduce((s, a) => s + a.reports, 0);

  const markResolved = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" as const, level: "resolved" as const } : a));
    setSelected(null);
  };

  const handleNewReport = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const stats = [
    { label: "ACTIVE ALERTS", value: activeCount, color: LEVEL_CONFIG.critical.color },
    { label: "CRITICAL", value: criticalCount, color: LEVEL_CONFIG.critical.color },
    { label: "TOTAL REPORTS", value: totalReports, color: LEVEL_CONFIG.resolved.color },
    { label: "LOCATIONS MONITORED", value: "47", color: "#4A9EFF" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Scanline overlay */}
      <div className="safebite-scanline" />

      {/* Critical alert banner */}
      {notifVisible && criticalCount > 0 && (
        <div
          className="bg-critical text-primary-foreground px-6 py-2 flex items-center justify-between text-[11px] tracking-[2px] font-bold"
          style={{ animation: "slide-in 0.3s ease" }}
        >
          <span style={{ animation: "blink 1s infinite" }}>
            ⚠ {criticalCount} CRITICAL ALERT{criticalCount > 1 ? "S" : ""} ACTIVE IN YOUR CITY — IMMEDIATE ACTION REQUIRED
          </span>
          <button onClick={() => setNotifVisible(false)} className="bg-transparent border-none text-foreground cursor-pointer text-lg leading-none">
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-7 pt-5 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-[22px]"
              style={{ background: "linear-gradient(135deg, hsl(var(--critical)), hsl(var(--warning)))", boxShadow: "0 0 20px hsl(var(--critical) / 0.35)" }}
            >
              🛡
            </div>
            <div>
              <div className="text-xl font-bold tracking-[3px] text-foreground">SAFEBITE</div>
              <div className="text-[10px] text-muted-foreground tracking-[2px]">LAHORE FOOD SAFETY NETWORK</div>
            </div>
          </div>

          <div className="flex gap-2">
            {NAV_ITEMS.map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className="px-4 py-2 rounded-md text-[10px] tracking-[2px] transition-all duration-200 hover:bg-foreground/5"
                style={{
                  border: `1px solid ${view === v.key ? "hsl(var(--accent))" : "hsl(var(--border))"}`,
                  background: view === v.key ? "hsl(var(--accent) / 0.1)" : "transparent",
                  color: view === v.key ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 py-4 flex-wrap">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground tracking-[2px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-7 py-5">
        {view === "dashboard" && (
          <AlertDashboard
            alerts={alerts}
            selected={selected}
            onSelect={setSelected}
            onResolve={markResolved}
            onViewMap={() => setView("map")}
            filter={filter}
            onFilterChange={setFilter}
          />
        )}
        {view === "map" && (
          <MapView alerts={alerts} selected={selected} onSelect={setSelected} />
        )}
        {view === "report" && (
          <ReportForm onSubmit={handleNewReport} onDone={() => setView("dashboard")} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-7 py-4 flex justify-between flex-wrap gap-2">
        <span className="text-[9px] text-muted-foreground/50 tracking-[2px]">SAFEBITE NETWORK © 2025 — LAHORE FOOD SAFETY INITIATIVE</span>
        <span className="text-[9px] text-muted-foreground/50 tracking-[2px]">INTERNATIONAL SOCIETY PROJECT</span>
      </div>
    </div>
  );
};

export default Index;
