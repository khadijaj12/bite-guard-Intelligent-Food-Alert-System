export interface Alert {
  id: number;
  level: "critical" | "warning" | "watch" | "resolved";
  title: string;
  location: string;
  product: string;
  reported: string;
  reports: number;
  status: "active" | "monitoring" | "resolved";
  description: string;
}

export type ViewType = "dashboard" | "map" | "report";
export type FilterType = "all" | "critical" | "warning" | "watch" | "resolved";

export const ALERTS: Alert[] = [
  {
    id: 1, level: "critical", title: "E. coli Contamination",
    location: "FreshMart - Downtown", product: "Romaine Lettuce (Batch #RL-2024-447)",
    reported: "2 hours ago", reports: 14, status: "active",
    description: "Multiple cases of gastrointestinal illness linked to romaine lettuce sold at this location. Immediate disposal recommended.",
  },
  {
    id: 2, level: "warning", title: "Undeclared Allergen",
    location: "Golden Bakery - Gulberg", product: "Whole Wheat Bread (Peanut traces)",
    reported: "5 hours ago", reports: 6, status: "active",
    description: "Peanut traces found in product not listed on label. Risk for people with nut allergies.",
  },
  {
    id: 3, level: "watch", title: "Mold Detected",
    location: "CityStore - Model Town", product: "Fresh Fruit Packages",
    reported: "Yesterday", reports: 3, status: "monitoring",
    description: "Visible mold reported on pre-packaged strawberry containers. Store investigating supplier.",
  },
  {
    id: 4, level: "resolved", title: "Salmonella Risk",
    location: "QuickFoods - Johar Town", product: "Chicken Shawarma",
    reported: "2 days ago", reports: 22, status: "resolved",
    description: "Location has passed re-inspection. Proper cooking and handling procedures now verified.",
  },
];

export const LEVEL_CONFIG: Record<string, { color: string; bg: string; label: string; pulse: boolean; twColor: string }> = {
  critical: { color: "#FF2D2D", bg: "#FF2D2D15", label: "CRITICAL", pulse: true, twColor: "critical" },
  warning:  { color: "#FF8C00", bg: "#FF8C0015", label: "WARNING",  pulse: true, twColor: "warning" },
  watch:    { color: "#F5C518", bg: "#F5C51815", label: "WATCH",    pulse: false, twColor: "watch" },
  resolved: { color: "#00C896", bg: "#00C89615", label: "RESOLVED", pulse: false, twColor: "resolved" },
};

export const MAP_POSITIONS: Record<number, { top: string; left: string }> = {
  1: { top: "28%", left: "55%" },
  2: { top: "45%", left: "38%" },
  3: { top: "65%", left: "28%" },
  4: { top: "75%", left: "16%" },
};
