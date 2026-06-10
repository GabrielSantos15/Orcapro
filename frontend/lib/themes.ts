export const THEMES = [
  { id: "emerald", label: "Verde", color: "#10b981" },
  { id: "indigo", label: "Índigo", color: "#6366f1" },
  { id: "purple", label: "Roxo", color: "#8b5cf6" },
  { id: "amber", label: "Âmbar", color: "#f59e0b" },
  { id: "sky", label: "Azul", color: "#0ea5e9" },
  { id: "pink", label: "Pink", color: "#ec4899" },
] as const;

export type Theme = (typeof THEMES)[number]["id"];