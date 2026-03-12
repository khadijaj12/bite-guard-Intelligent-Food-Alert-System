import { useState } from "react";
import { Alert, LEVEL_CONFIG } from "@/lib/alertData";

interface ReportFormProps {
  onSubmit: (alert: Alert) => void;
  onDone: () => void;
}

type FormLevel = "watch" | "warning" | "critical";

export function ReportForm({ onSubmit, onDone }: ReportFormProps) {
  const [form, setForm] = useState({ title: "", location: "", product: "", level: "warning" as FormLevel, description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.title || !form.location) return;
    const newAlert: Alert = {
      id: Date.now(),
      level: form.level,
      title: form.title,
      location: form.location,
      product: form.product,
      reported: "Just now",
      reports: 1,
      status: "active",
      description: form.description,
    };
    onSubmit(newAlert);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ title: "", location: "", product: "", level: "warning", description: "" });
      onDone();
    }, 2500);
  };

  const canSubmit = form.title && form.location;

  if (submitted) {
    return (
      <div
        className="max-w-[520px] border border-accent bg-accent/10 rounded-lg p-10 text-center"
        style={{ animation: "slide-in 0.3s ease" }}
      >
        <div className="text-5xl mb-3">✓</div>
        <div className="text-base font-bold text-accent tracking-[2px]">REPORT SUBMITTED</div>
        <div className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          Your report is now live on the network.<br />Thank you for keeping Lahore safe.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px]">
      <div className="text-[10px] text-muted-foreground tracking-[2px] mb-4">
        SUBMIT A FOOD SAFETY INCIDENT REPORT
      </div>

      <div className="flex flex-col gap-3.5">
        {[
          { label: "INCIDENT TITLE *", key: "title" as const, placeholder: "e.g. Expired meat sold at..." },
          { label: "LOCATION *", key: "location" as const, placeholder: "Store name & neighborhood" },
          { label: "PRODUCT / ITEM", key: "product" as const, placeholder: "Product name & batch if known" },
        ].map(field => (
          <div key={field.key}>
            <div className="text-[9px] text-muted-foreground tracking-[2px] mb-1.5">{field.label}</div>
            <input
              value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-card border border-border rounded-md px-3.5 py-2.5 text-foreground text-xs outline-none font-mono focus:border-info transition-colors"
            />
          </div>
        ))}

        <div>
          <div className="text-[9px] text-muted-foreground tracking-[2px] mb-1.5">SEVERITY LEVEL</div>
          <div className="flex gap-2">
            {(["watch", "warning", "critical"] as FormLevel[]).map(l => {
              const cfg = LEVEL_CONFIG[l];
              const isActive = form.level === l;
              return (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, level: l })}
                  className="flex-1 py-2 rounded-md text-[9px] tracking-[2px] uppercase transition-all duration-200"
                  style={{
                    border: `1px solid ${isActive ? cfg.color : "hsl(var(--border))"}`,
                    background: isActive ? cfg.bg : "transparent",
                    color: isActive ? cfg.color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[9px] text-muted-foreground tracking-[2px] mb-1.5">DESCRIPTION</div>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you observed in detail..."
            rows={4}
            className="w-full bg-card border border-border rounded-md px-3.5 py-2.5 text-foreground text-xs outline-none font-mono resize-y focus:border-info transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="py-3.5 rounded-md text-[11px] tracking-[3px] font-bold mt-1 transition-all duration-200"
          style={{
            background: canSubmit ? "linear-gradient(90deg, hsl(var(--critical)), hsl(var(--warning)))" : "hsl(var(--muted))",
            color: canSubmit ? "#fff" : "hsl(var(--muted-foreground))",
            cursor: canSubmit ? "pointer" : "not-allowed",
            border: "none",
          }}
        >
          ⚑ SUBMIT REPORT TO NETWORK
        </button>

        <div className="text-[9px] text-muted-foreground/60 tracking-[1px]">
          * Required fields. Reports are reviewed and published within minutes.
        </div>
      </div>
    </div>
  );
}
