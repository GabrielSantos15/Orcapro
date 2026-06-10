"use client";
import { useTheme } from "next-themes";
import { useThemeColor } from "@/app/context/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import { THEMES } from "@/lib/themes"; 

export default function AppearancePage() {
  const {
    theme: modeTheme,
    setTheme: setModeTheme,
  } = useTheme();

  const {
    theme: colorTheme,
    setTheme: setColorTheme,
  } = useThemeColor();

  return (
    <main className="space-y-6">
      <HeaderDashboard
        title="Aparência"
        subTitle="Personalize a aparência do OrcaPro"
      />

      {/* MODO */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6">
        <h2 className="font-medium mb-4">
          Tema
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setModeTheme("light")}
            className={`p-4 rounded-2xl border transition ${
              modeTheme === "light"
                ? "border-[var(--primary-color)]"
                : "border-[var(--border-color)]"
            }`}
          >
            <Sun className="mb-3" />
            <h3 className="font-medium">Claro</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Aparência clara.
            </p>
          </button>

          <button
            onClick={() => setModeTheme("dark")}
            className={`p-4 rounded-2xl border transition ${
              modeTheme === "dark"
                ? "border-[var(--primary-color)]"
                : "border-[var(--border-color)]"
            }`}
          >
            <Moon className="mb-3" />
            <h3 className="font-medium">Escuro</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Menos brilho à noite.
            </p>
          </button>

          <button
            onClick={() => setModeTheme("system")}
            className={`p-4 rounded-2xl border transition ${
              modeTheme === "system"
                ? "border-[var(--primary-color)]"
                : "border-[var(--border-color)]"
            }`}
          >
            <Monitor className="mb-3" />
            <h3 className="font-medium">Sistema</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Usa o tema do dispositivo.
            </p>
          </button>
        </div>
      </section>

      {/* CORES */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6">
        <h2 className="font-medium mb-4">
          Cor principal
        </h2>

        <div className="flex flex-wrap gap-4">
          {THEMES.map((color) => (
            <button
              key={color.id}
              onClick={() =>
                setColorTheme(color.id)
              }
              className="group flex flex-col items-center"
            >
              <div
                className={`size-14 rounded-full border-4 border-white shadow-md transition-all ${
                  colorTheme === color.id
                    ? "ring-2 ring-offset-2 ring-[var(--primary-color)] scale-110"
                    : "group-hover:scale-105"
                }`}
                style={{
                  backgroundColor: color.color,
                }}
              />

              <span className="text-sm mt-2">
                {color.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* PREVIEW */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6">
        <h2 className="font-medium mb-4">
          Pré-visualização
        </h2>

        <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">
                Saldo Atual
              </h3>

              <p className="text-2xl font-bold">
                R$ 12.450,00
              </p>
            </div>

            <button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-xl transition">
              Adicionar
            </button>
          </div>

          <div className="h-3 rounded-full bg-[var(--border-color)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary-color)]"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}