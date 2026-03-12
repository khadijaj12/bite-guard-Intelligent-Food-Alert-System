import { Alert, LEVEL_CONFIG, MAP_POSITIONS } from "@/lib/alertData";

interface MapDotProps {
  alert: Alert;
  selected: boolean;
  onClick: () => void;
}

export function MapDot({ alert, selected, onClick }: MapDotProps) {
  const cfg = LEVEL_CONFIG[alert.level];
  const pos = MAP_POSITIONS[alert.id] || { top: "50%", left: "50%" };

  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{
        top: pos.top,
        left: pos.left,
        zIndex: selected ? 10 : 5,
        transform: "translate(-50%, -50%)",
      }}
    >
      {cfg.pulse && (
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: "translate(-50%, -50%)",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: cfg.color,
            opacity: 0.25,
            animation: "ping-dot 1.5s ease-out infinite",
          }}
        />
      )}
      <div
        className="rounded-full relative transition-all duration-200"
        style={{
          width: selected ? 20 : 14,
          height: selected ? 20 : 14,
          background: cfg.color,
          border: `3px solid ${selected ? "#fff" : cfg.color}`,
          boxShadow: `0 0 ${selected ? 20 : 8}px ${cfg.color}`,
        }}
      />
    </div>
  );
}
