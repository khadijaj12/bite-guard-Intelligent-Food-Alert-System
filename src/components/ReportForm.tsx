import { useState } from "react";
import { Alert, LEVEL_CONFIG } from "@/lib/alertData";

interface ReportFormProps {
  onSubmit: (alert: Alert) => void;
  onDone: () => void;
}

type FormLevel = "watch" | "warning" | "critical";

const LEVEL_DESCRIPTIONS: Record<FormLevel, string> = {
  watch: "Minor concern — worth keeping an eye on",
  warning: "Significant risk — needs prompt attention",
  critical: "Serious danger — immediate action required",
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
        className="max-w-[560px] bg-card border border-accent rounded-2xl p-12 text-center shadow-md"
        style={{ animation: "fade-in 0.3s ease" }}
      >
        <div className="text-6xl mb-4">✅</div>
        <div className="text-xl font-bold text-accent">Report Submitted!</div>
        <div className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Your report is now live on the network.<br />Thank you for helping keep Lahore safe.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px]">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground mb-1">Submit a Report</h2>
        <p className="text-sm text-muted-foreground">Spotted a food safety issue? Let the community know so others can stay safe.</p>
      </div>

      <div className="flex flex-col gap-5 bg-card rounded-2xl border border-border p-5 sm:p-7 shadow-sm">
        {[
          { label: "What happened?", key: "title" as const, placeholder: "e.g. Expired meat on sale at...", required: true },
          { label: "Where was it?", key: "location" as const, placeholder: "Store name & area", required: true },
          { label: "Which product?", key: "product" as const, placeholder: "Product name & batch if known (optional)", required: false },
        ].map(field => {
          const hasError = field.required && touched[field.key] && !form[field.key];
          return (
            <div key={field.key}>
              <label className="text-sm text-foreground mb-2 block font-medium">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </label>
              <input
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                onBlur={() => setTouched({ ...touched, [field.key]: true })}
                placeholder={field.placeholder}
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
                style={{
                  borderColor: hasError ? "hsl(var(--destructive))" : "hsl(var(--border))",
                }}
              />
              {hasError && (
                <p className="text-xs mt-1.5 text-destructive font-medium" style={{ animation: "fade-in 0.2s ease" }}>
                  Please fill in this field
                </p>
              )}
            </div>
          );
        })}

        <div>
          <label className="text-sm text-foreground mb-2 block font-medium">How serious is it?</label>
          <div className="flex gap-2">
            {(["watch", "warning", "critical"] as FormLevel[]).map(l => {
              const cfg = LEVEL_CONFIG[l];
              const isActive = form.level === l;
              return (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, level: l })}
                  className="flex-1 py-3 rounded-xl text-sm capitalize transition-all duration-200 font-medium border-2"
                  style={{
                    borderColor: isActive ? cfg.color : "hsl(var(--border))",
                    background: isActive ? cfg.bg : "transparent",
                    color: isActive ? cfg.color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {LEVEL_DESCRIPTIONS[form.level]}
          </p>
        </div>

        <div>
          <label className="text-sm text-foreground mb-2 block font-medium">Tell us more</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you saw or experienced..."
            rows={4}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none resize-y transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm"
          style={{
            background: canSubmit ? "hsl(var(--primary))" : "hsl(var(--muted))",
            color: canSubmit ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
            cursor: canSubmit ? "pointer" : "not-allowed",
            border: "none",
          }}
        >
          📝 Submit Report
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Fields marked with <span className="text-destructive">*</span> are required. Reports are reviewed within minutes.
        </p>
      </div>
    </div>
  );
}
