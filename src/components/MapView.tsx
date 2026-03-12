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
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[280px]">
        <div className="text-[10px] text-muted-foreground tracking-[2px] mb-3">
          LAHORE CITY — LIVE CONTAMINATION MAP
        </div>
        <div
          className="relative h-[400px] rounded-lg border border-border overflow-hidden"
          style={{ background: "var(--gradient-map)" }}
        >
          {/* Grid lines */}
          {[...Array(9)].map((_, i) => (
            <div key={`h${i}`} className="absolute left-0 right-0 h-px bg-foreground/[0.02]" style={{ top: `${i * 12.5}%` }} />
          ))}
          {[...Array(9)].map((_, i) => (
            <div key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-foreground/[0.02]" style={{ left: `${i * 12.5}%` }} />
          ))}

          <div className="absolute top-3.5 left-4 text-[10px] text-info/50 tracking-[2px]">LAHORE PKI</div>
          <div className="absolute top-3.5 right-4 text-[9px] text-foreground/10 tracking-[1px]">31.5204° N, 74.3587° E</div>

          {ZONES.map(z => (
            <div
              key={z.label}
              className="absolute text-[7px] text-foreground/10 tracking-[1px] whitespace-nowrap"
              style={{ top: z.top, left: z.left, transform: "translate(-50%, 16px)" }}
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
          <div className="absolute bottom-3.5 right-3.5 bg-background/60 rounded-md px-3 py-2">
            {Object.entries(LEVEL_CONFIG).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 mb-1 last:mb-0">
                <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                <span className="text-[8px] text-muted-foreground tracking-[1px]">{v.label}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-3.5 left-3.5 text-[8px] text-foreground/10 tracking-[1px]">
            CLICK MARKER FOR DETAILS
          </div>
        </div>
      </div>

      {selected && (() => {
        const cfg = LEVEL_CONFIG[selected.level] || LEVEL_CONFIG.watch;
        return (
          <div
            className="w-[250px] bg-card rounded-lg p-4 self-start"
            style={{ border: `1px solid ${cfg.color}`, animation: "slide-in 0.2s ease" }}
          >
            <div className="text-[8px] tracking-[2px] mb-2.5" style={{ color: cfg.color }}>SELECTED INCIDENT</div>
            <div className="text-[15px] font-bold text-foreground mb-2">{selected.title}</div>
            <div className="text-[10px] text-muted-foreground mb-1">📍 {selected.location}</div>
            {selected.product && <div className="text-[10px] text-muted-foreground/70 mb-2.5">🏷 {selected.product}</div>}
            <div className="text-[11px] text-muted-foreground leading-relaxed mb-3.5">{selected.description}</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[22px] font-bold" style={{ color: cfg.color }}>{selected.reports}</div>
                <div className="text-[8px] text-muted-foreground tracking-[1px]">REPORTS</div>
              </div>
              <button
                onClick={() => onSelect(null)}
                className="bg-transparent border border-border text-muted-foreground px-3 py-1.5 cursor-pointer rounded text-[10px] hover:border-foreground/30 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
