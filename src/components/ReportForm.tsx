import { useState } from "react";
import { Alert, LEVEL_CONFIG } from "@/lib/alertData";

interface ReportFormProps {
  onSubmit: (alert: Alert) => void;
  onDone: () => void;
}

type FormLevel = "watch" | "warning" | "critical";

const LEVEL_DESCRIPTIONS: Record<FormLevel, string> = {
  watch: "Minor concern, worth monitoring",
  warning: "Significant risk, needs attention",
  critical: "Severe danger, immediate action needed",
};

export function ReportForm({ onSubmit, onDone }: ReportFormProps) {
  const [form, setForm] = useState({ title: "", location: "", product: "", level: "warning" as FormLevel, description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    if (!form.title || !form.location) {
      setTouched({ title: true, location: true });
      return;
    }
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
      setTouched({});
      onDone();
    }, 2500);
  };

  const canSubmit = form.title && form.location;

  if (submitted) {
    return (
      <div
        className="max-w-[560px] border border-accent bg-accent/10 rounded-xl p-12 text-center"
        style={{ animation: "slide-in 0.3s ease" }}
      >
        <div className="text-6xl mb-4">✅</div>
        <div className="text-xl font-bold text-accent tracking-wide">Report Submitted!</div>
        <div className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Your report is now live on the network.<br />Thank you for keeping Lahore safe.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Submit a Report</h2>
        <p className="text-sm text-muted-foreground">Help keep Lahore safe by reporting food safety incidents</p>
      </div>

      <div className="flex flex-col gap-5 bg-card rounded-xl border border-border p-5 sm:p-6">
        {[
          { label: "Incident Title", key: "title" as const, placeholder: "e.g. Expired meat sold at...", required: true },
          { label: "Location", key: "location" as const, placeholder: "Store name & neighborhood", required: true },
          { label: "Product / Item", key: "product" as const, placeholder: "Product name & batch if known (optional)", required: false },
        ].map(field => {
          const hasError = field.required && touched[field.key] && !form[field.key];
          return (
            <div key={field.key}>
              <label className="text-xs text-muted-foreground tracking-wide mb-2 block font-medium">
                {field.label} {field.required && <span className="text-critical">*</span>}
              </label>
              <input
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                onBlur={() => setTouched({ ...touched, [field.key]: true })}
                placeholder={field.placeholder}
                className="w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm outline-none font-mono transition-colors"
                style={{
                  borderColor: hasError ? "hsl(var(--critical))" : "hsl(var(--border))",
                }}
              />
              {hasError && (
                <p className="text-xs mt-1.5 text-critical" style={{ animation: "slide-in 0.2s ease" }}>
                  This field is required
                </p>
              )}
            </div>
          );
        })}

        <div>
          <label className="text-xs text-muted-foreground tracking-wide mb-2 block font-medium">Severity Level</label>
          <div className="flex gap-2">
            {(["watch", "warning", "critical"] as FormLevel[]).map(l => {
              const cfg = LEVEL_CONFIG[l];
              const isActive = form.level === l;
              return (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, level: l })}
                  className="flex-1 py-3 rounded-lg text-xs tracking-wide capitalize transition-all duration-200 font-medium"
                  style={{
                    border: `2px solid ${isActive ? cfg.color : "hsl(var(--border))"}`,
                    background: isActive ? cfg.bg : "transparent",
                    color: isActive ? cfg.color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {LEVEL_DESCRIPTIONS[form.level]}
          </p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground tracking-wide mb-2 block font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you observed in detail..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none font-mono resize-y focus:border-info transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="py-4 rounded-lg text-sm tracking-wider font-bold transition-all duration-200"
          style={{
            background: canSubmit ? "linear-gradient(90deg, hsl(var(--critical)), hsl(var(--warning)))" : "hsl(var(--muted))",
            color: canSubmit ? "#fff" : "hsl(var(--muted-foreground))",
            cursor: canSubmit ? "pointer" : "not-allowed",
            border: "none",
            opacity: canSubmit ? 1 : 0.7,
          }}
        >
          📝 Submit Report
        </button>

        <p className="text-xs text-muted-foreground/50 text-center">
          Fields marked with <span className="text-critical">*</span> are required. Reports are reviewed within minutes.
        </p>
      </div>
    </div>
  );
}
