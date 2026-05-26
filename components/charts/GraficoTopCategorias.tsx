"use client";

import { useMemo, useState } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { Transacao } from "@/interfaces/Transacao";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GraficoTopCategoriasProps {
  transacoes: Transacao[];
}

const CORES_TOP_5 = ["#8b5cf6", "#c084fc", "#e879f9", "#f472b6", "#fb7185"];

export default function GraficoTopCategorias({
  transacoes,
}: GraficoTopCategoriasProps) {
  
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const { dadosGrafico, chartConfig } = useMemo(() => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    const transacoesDoMes = transacoes.filter((t) => {
      const dataTransacao = new Date(t.dataTransacao);
      return (
        dataTransacao.getMonth() === mesAtual &&
        dataTransacao.getFullYear() === anoAtual
      );
    });

    const mapaDespesas = new Map<string, number>();

    transacoesDoMes.forEach((t) => {
      if (t.categoria?.tipo === "SAIDA") {
        const atual = mapaDespesas.get(t.categoria.nome) || 0;
        mapaDespesas.set(t.categoria.nome, atual + t.valor);
      }
    });

    const top5 = Array.from(mapaDespesas.entries())
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);

    const config = {} as ChartConfig;
    const dadosComCor = top5.map((item, index) => {
      const key = `categoria${index}`;
      const corReal = CORES_TOP_5[index];
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
  }, [transacoes]);

  const semDados = dadosGrafico.length === 0;

  return (
    <div className="w-full p-2 sm:p-4 flex flex-col justify-center h-full">
      {semDados ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-4 text-gray-500">
          <p className="text-sm text-gray-400">Nenhuma despesa registrada.</p>
        </div>
      ) : (
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
                    className="bg-white border-none shadow-md"
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
                stroke="#ffffff"
                paddingAngle={2}
                activeIndex={activeIndex}
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
                  className={`flex items-center justify-between text-sm sm:text-xs md:text-sm cursor-pointer transition-all duration-300 ${
                  isDimmed ? "opacity-40" : "opacity-100 hover:scale-[1.02]"
                }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0 transition-colors"
                      style={{ backgroundColor: isDimmed ? '#d1d5db' : item.corOriginal }}
                    />
                    <span className={`font-medium truncate max-w-[120px] transition-colors ${isDimmed ? "text-gray-400" : "text-gray-700"}`}>
                      {item.categoria}
                    </span>
                  </div>
                  
                  <span className={`font-bold transition-colors ${isDimmed ? "text-gray-400" : "text-gray-900"}`}>
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
      )}
    </div>
  );
}