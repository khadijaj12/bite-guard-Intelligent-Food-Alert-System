import { Alert, LEVEL_CONFIG } from "@/lib/alertData";
import { MapDot } from "./MapDot";

interface MapViewProps {
  alerts: Alert[];
  selected: Alert | null;
  onSelect: (alert: Alert | null) => void;
}

const ZONES = [
  { label: "Downtown", top: "22%", left: "50%" },
  { label: "Gulberg", top: "40%", left: "32%" },
  { label: "Model Town", top: "60%", left: "22%" },
  { label: "Johar Town", top: "72%", left: "10%" },
];

export function MapView({ alerts, selected, onSelect }: MapViewProps) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground mb-1">Live Incident Map</h2>
        <p className="text-sm text-muted-foreground">Click any marker to see details about the food safety incident at that location.</p>
      </div>

      <div className="flex gap-5 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <div
            className="relative h-[420px] rounded-2xl border border-border overflow-hidden shadow-sm"
            style={{ background: "linear-gradient(145deg, hsl(210 40% 96%), hsl(210 30% 92%))" }}
          >
            {/* Grid lines */}
            {[...Array(9)].map((_, i) => (
              <div key={`h${i}`} className="absolute left-0 right-0 h-px bg-foreground/[0.05]" style={{ top: `${i * 12.5}%` }} />
            ))}
            {[...Array(9)].map((_, i) => (
              <div key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-foreground/[0.05]" style={{ left: `${i * 12.5}%` }} />
            ))}

            <div className="absolute top-4 left-5 text-sm text-primary/60 font-semibold">Lahore, Pakistan</div>
            <div className="absolute top-4 right-5 text-xs text-foreground/20">31.5204° N, 74.3587° E</div>

            {ZONES.map(z => (
              <div
                key={z.label}
                className="absolute text-[10px] text-foreground/25 font-medium whitespace-nowrap"
                style={{ top: z.top, left: z.left, transform: "translate(-50%, 18px)" }}
              >
                {z.label}
              </div>
            ))}

            {alerts.map(a => (
              <MapDot
                key={a.id}
                alert={a}
                selected={selected?.id === a.id}
                onClick={() => onSelect(selected?.id === a.id ? null : a)}
              />
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-border shadow-sm">
              <div className="text-xs text-muted-foreground mb-2 font-semibold">Legend</div>
              {Object.entries(LEVEL_CONFIG).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <div className="w-3 h-3 rounded-full" style={{ background: v.color }} />
                  <span className="text-xs text-muted-foreground">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (() => {
          const cfg = LEVEL_CONFIG[selected.level] || LEVEL_CONFIG.watch;
          return (
            <div
              className="w-full sm:w-[300px] bg-card rounded-2xl p-5 self-start border border-border shadow-md"
              style={{ animation: "fade-in 0.2s ease" }}
            >
              <div className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: cfg.color }}>
                📌 Selected Incident
              </div>
              <div className="text-lg font-bold text-foreground mb-2">{selected.title}</div>
              <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                📍 {selected.location}
              </div>
              {selected.product && (
                <div className="text-sm text-muted-foreground/70 mb-3 flex items-center gap-1.5">
                  🏷️ {selected.product}
                </div>
              )}
              <div className="text-sm text-muted-foreground leading-relaxed mb-4">{selected.description}</div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-2xl font-bold" style={{ color: cfg.color }}>{selected.reports}</div>
                  <div className="text-xs text-muted-foreground">reports filed</div>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="border border-border text-muted-foreground px-4 py-2 cursor-pointer rounded-lg text-sm hover:bg-muted transition-colors font-medium bg-background"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}

        {!selected && (
          <div className="w-full sm:w-[300px] bg-card rounded-2xl p-6 self-start border border-border shadow-sm text-center">
            <div className="text-4xl mb-3">👆</div>
            <div className="text-base text-foreground font-semibold mb-1">Select a marker</div>
            <p className="text-sm text-muted-foreground">Click on any dot on the map to see full incident details</p>
          </div>
        )}
      </div>
    </div>
  );
}
