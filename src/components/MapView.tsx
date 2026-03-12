import { Alert, LEVEL_CONFIG } from "@/lib/alertData";
import { MapDot } from "./MapDot";

interface MapViewProps {
  alerts: Alert[];
  selected: Alert | null;
  onSelect: (alert: Alert | null) => void;
}

const ZONES = [
  { label: "DOWNTOWN", top: "22%", left: "50%" },
  { label: "GULBERG", top: "40%", left: "32%" },
  { label: "MODEL TOWN", top: "60%", left: "22%" },
  { label: "JOHAR TOWN", top: "72%", left: "10%" },
];

export function MapView({ alerts, selected, onSelect }: MapViewProps) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground mb-1">Live Contamination Map</h2>
        <p className="text-sm text-muted-foreground">Click on any marker to view incident details</p>
      </div>

      <div className="flex gap-5 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <div
            className="relative h-[420px] rounded-xl border border-border overflow-hidden"
            style={{ background: "var(--gradient-map)" }}
          >
            {/* Grid lines */}
            {[...Array(9)].map((_, i) => (
              <div key={`h${i}`} className="absolute left-0 right-0 h-px bg-foreground/[0.03]" style={{ top: `${i * 12.5}%` }} />
            ))}
            {[...Array(9)].map((_, i) => (
              <div key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-foreground/[0.03]" style={{ left: `${i * 12.5}%` }} />
            ))}

            <div className="absolute top-4 left-5 text-xs text-info/60 tracking-wider font-medium">Lahore, Pakistan</div>
            <div className="absolute top-4 right-5 text-[10px] text-foreground/15 tracking-wide">31.5204° N, 74.3587° E</div>

            {ZONES.map(z => (
              <div
                key={z.label}
                className="absolute text-[9px] text-foreground/15 tracking-wider whitespace-nowrap font-medium"
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
            <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm rounded-lg px-3.5 py-3 border border-border/50">
              <div className="text-[9px] text-muted-foreground tracking-wider mb-2 font-medium">LEGEND</div>
              {Object.entries(LEVEL_CONFIG).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }} />
                  <span className="text-[10px] text-muted-foreground tracking-wide">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (() => {
          const cfg = LEVEL_CONFIG[selected.level] || LEVEL_CONFIG.watch;
          return (
            <div
              className="w-full sm:w-[280px] bg-card rounded-xl p-5 self-start"
              style={{ border: `1px solid ${cfg.color}`, animation: "slide-in 0.2s ease" }}
            >
              <div className="text-[10px] tracking-wider mb-3 font-bold" style={{ color: cfg.color }}>
                📌 Selected Incident
              </div>
              <div className="text-base font-bold text-foreground mb-2">{selected.title}</div>
              <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <span>📍</span> {selected.location}
              </div>
              {selected.product && (
                <div className="text-sm text-muted-foreground/70 mb-3 flex items-center gap-1">
                  <span>🏷</span> {selected.product}
                </div>
              )}
              <div className="text-sm text-muted-foreground leading-relaxed mb-4">{selected.description}</div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-2xl font-bold" style={{ color: cfg.color }}>{selected.reports}</div>
                  <div className="text-[10px] text-muted-foreground tracking-wide">reports filed</div>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="bg-transparent border border-border text-muted-foreground px-4 py-2 cursor-pointer rounded-lg text-xs hover:border-foreground/30 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}

        {!selected && (
          <div className="w-full sm:w-[280px] bg-card/50 rounded-xl p-5 self-start border border-border/50 text-center">
            <div className="text-3xl mb-3">👆</div>
            <div className="text-sm text-muted-foreground font-medium mb-1">Select a marker</div>
            <p className="text-xs text-muted-foreground/60">Click on any dot on the map to see full incident details</p>
          </div>
        )}
      </div>
    </div>
  );
}
