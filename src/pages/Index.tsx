import { useState } from "react";
import { Alert, ALERTS, LEVEL_CONFIG, ViewType, FilterType } from "@/lib/alertData";
import { AlertDashboard } from "@/components/AlertDashboard";
import { MapView } from "@/components/MapView";
import { ReportForm } from "@/components/ReportForm";
import { toast } from "sonner";

const NAV_ITEMS: { key: ViewType; label: string; icon: string }[] = [
  { key: "dashboard", label: "Alerts", icon: "📋" },
  { key: "map", label: "Map", icon: "🗺️" },
  { key: "report", label: "Report", icon: "📝" },
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
    toast.success("Alert marked as resolved", { description: "The incident has been updated successfully." });
  };

  const handleNewReport = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    toast.success("Report submitted!", { description: "Your food safety report is now live." });
  };

  const stats = [
    { label: "Active Alerts", value: activeCount, color: LEVEL_CONFIG.critical.color, icon: "🔴" },
    { label: "Critical", value: criticalCount, color: LEVEL_CONFIG.critical.color, icon: "⚠️" },
    { label: "Total Reports", value: totalReports, color: LEVEL_CONFIG.resolved.color, icon: "📊" },
    { label: "Locations Monitored", value: "47", color: "#4A9EFF", icon: "📍" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Scanline overlay */}
      <div className="safebite-scanline" />

      {/* Critical alert banner */}
      {notifVisible && criticalCount > 0 && (
        <div
          className="bg-critical px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm font-bold"
          style={{ animation: "slide-in 0.3s ease", color: "#fff" }}
        >
          <span className="flex items-center gap-2" style={{ animation: "blink 1s infinite" }}>
            <span className="text-base">⚠️</span>
            <span>{criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""} — Immediate Action Required</span>
          </span>
          <button
            onClick={() => setNotifVisible(false)}
            className="bg-transparent border-none cursor-pointer text-xl leading-none ml-4 hover:opacity-70 transition-opacity"
            style={{ color: "#fff" }}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-7 pt-5 pb-1 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg, hsl(var(--critical)), hsl(var(--warning)))", boxShadow: "0 0 24px hsl(var(--critical) / 0.35)" }}
            >
              🛡
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-[3px] text-foreground">SAFEBITE</div>
              <div className="text-[11px] text-muted-foreground tracking-wider">Lahore Food Safety Network</div>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2">
            {NAV_ITEMS.map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className="px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm tracking-wide transition-all duration-200 hover:bg-foreground/5 flex items-center gap-1.5"
                style={{
                  border: `1px solid ${view === v.key ? "hsl(var(--accent))" : "hsl(var(--border))"}`,
                  background: view === v.key ? "hsl(var(--accent) / 0.12)" : "transparent",
                  color: view === v.key ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                  fontWeight: view === v.key ? 700 : 400,
                }}
              >
                <span className="hidden sm:inline">{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-5">
          {stats.map(s => (
            <div key={s.label} className="bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{s.icon}</span>
                <span className="text-[11px] text-muted-foreground tracking-wide">{s.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-7 py-5">
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
      <div className="border-t border-border px-4 sm:px-7 py-5 flex justify-between flex-wrap gap-2">
        <span className="text-[10px] text-muted-foreground/50 tracking-wider">SafeBite Network © 2025 — Lahore Food Safety Initiative</span>
        <span className="text-[10px] text-muted-foreground/50 tracking-wider">International Society Project</span>
      </div>
    </div>
  );
};

export default Index;
