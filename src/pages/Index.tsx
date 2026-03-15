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
    { label: "Locations", value: "47", color: "hsl(var(--info))", icon: "📍" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle background glow */}
      <div className="safebite-glow" />

      {/* Critical alert banner */}
      {notifVisible && criticalCount > 0 && (
        <div
          className="bg-destructive text-destructive-foreground px-4 sm:px-6 py-3 flex items-center justify-between text-sm font-semibold"
          style={{ animation: "fade-in 0.3s ease" }}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{criticalCount} critical alert{criticalCount > 1 ? "s" : ""} — please review immediately</span>
          </span>
          <button
            onClick={() => setNotifVisible(false)}
            className="bg-transparent border-none cursor-pointer text-xl leading-none ml-4 hover:opacity-70 transition-opacity text-destructive-foreground"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-8 pt-6 pb-2 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-2xl shadow-md">
              🛡
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">SafeBite</div>
              <div className="text-xs text-muted-foreground">Lahore Food Safety Network</div>
            </div>
          </div>

          <nav className="flex gap-1.5">
            {NAV_ITEMS.map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 font-medium ${
                  view === v.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="hidden sm:inline">{v.icon}</span>
                {v.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-5 max-w-6xl mx-auto">
          {stats.map(s => (
            <div key={s.label} className="bg-background rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 sm:px-8 py-6 max-w-6xl mx-auto" style={{ animation: "fade-in 0.4s ease" }}>
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-4 sm:px-8 py-5 flex justify-between flex-wrap gap-2 max-w-6xl mx-auto">
        <span className="text-xs text-muted-foreground">SafeBite Network © 2025 — Lahore Food Safety Initiative</span>
        <span className="text-xs text-muted-foreground">International Society Project</span>
      </footer>
    </div>
  );
};

export default Index;
