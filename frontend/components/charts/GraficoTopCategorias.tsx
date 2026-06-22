"use client";

import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { useModalStore } from "@/store/useModalStore";

// 1. Interface limpa, sem redundâncias
interface GraficoTopCategoriasProps {
  dataInicio: string;
  dataFim: string;
  limite?: number;
}

const CORES_TOP_5 = ["#8b5cf6", "#c084fc", "#e879f9", "#f472b6", "#fb7185"];

export default function GraficoTopCategorias({ dataInicio, dataFim, limite = 5 }: GraficoTopCategoriasProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const { resumoCategorias, fetchResumoCategorias, carregandoCategoria } = useResumoTransacoes();
  const { atualizarGatilho } = useModalStore();

  useEffect(() => {
    if (dataInicio && dataFim) {
      fetchResumoCategorias(dataInicio, dataFim);
    }
  }, [atualizarGatilho, dataInicio, dataFim]);

  const { dadosGrafico, chartConfig } = useMemo(() => {
    const mapaDespesas = new Map<string, number>();

    resumoCategorias.forEach((t) => {
      if (t.tipoCategoria === "SAIDA") {
        const atual = mapaDespesas.get(t.nomeCategoria) || 0;
        mapaDespesas.set(t.nomeCategoria, atual + t.totalGasto);
      }
    });

    const topCategorias = Array.from(mapaDespesas.entries())
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, limite);

    const config = {} as ChartConfig;

    const dadosComCor = topCategorias.map((item, index) => {
      const key = `categoria${index}`;
      const corReal = CORES_TOP_5[index % CORES_TOP_5.length];

      config[key] = {
        label: item.categoria,
        color: corReal,
      };

      return {
        ...item,
        id: key,
        fill: `var(--color-${key})`,
        corOriginal: corReal,
      };
    });

    return { dadosGrafico: dadosComCor, chartConfig: config };
  }, [resumoCategorias, limite]);

  // ==========================================
  // ESTADOS DA UI 
  // ==========================================

  // 1. Estado de Carregamento
  if (carregandoCategoria) {
    return (
      <div className="w-full p-2 sm:p-4 flex flex-col justify-center h-full gap-6">
        <div className="mx-auto w-[180px] h-[180px] "></div>

        <div className="flex flex-col gap-3 px-2 mt-2">
          {Array.from({ length: limite }).map((_, i) => (
            <div key={i} className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-3 h-3 rounded-full skeleton shrink-0"></div>
                <div className="h-3 w-full skeleton rounded-md"></div>
              </div>
              <div className="h-4 w-16 skeleton rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Estado Vazio
  if (dadosGrafico.length === 0) {
    return (
      <div className="w-full p-2 sm:p-4 flex flex-col justify-center h-full">
        <div className="flex h-[280px] flex-col items-center justify-center gap-4">
          <p className="text-sm text-[var(--text-muted)]">Nenhuma despesa registrada.</p>
        </div>
      </div>
    );
  }

  // 3. Renderização Principal (Sucesso)
  return (
    <div className="w-full p-2 sm:p-4 flex flex-col justify-center h-full">
      <div className="flex flex-col gap-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] shadow-md"
                  formatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value as number)
                  }
                />
              }
            />

            <Pie
              data={dadosGrafico}
              dataKey="valor"
              nameKey="id"
              innerRadius={55}
              outerRadius={80}
              strokeWidth={3}
              stroke="var(--bg-surface)"
              paddingAngle={2}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {dadosGrafico.map((entry, index) => {
                const isDimmed = activeIndex !== undefined && activeIndex !== index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="transition-all duration-300 ease-in-out cursor-pointer"
                    style={{
                      opacity: isDimmed ? 0.25 : 1,
                      filter: isDimmed ? 'grayscale(30%)' : 'none'
                    }}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legenda */}
        <div className="flex flex-col gap-3 px-2">
          {dadosGrafico.map((item, index) => {
            const isDimmed = activeIndex !== undefined && activeIndex !== index;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(activeIndex === index ? undefined : index)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                className={`flex items-center justify-between text-sm sm:text-xs md:text-sm cursor-pointer transition-all duration-300 ${isDimmed ? "opacity-40" : "opacity-100 hover:scale-[1.02]"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 transition-colors"
                    style={{ backgroundColor: isDimmed ? 'var(--border-color)' : item.corOriginal }}
                  />
                  <span className={`font-medium truncate max-w-[120px] transition-colors ${isDimmed ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                    {item.categoria}
                  </span>
                </div>

                <span className={`font-bold transition-colors ${isDimmed ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.valor)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}