"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { FiltroResumoAnual } from "@/interfaces/FiltroResumoAnual";

const chartConfig = {
  receitas: {
    label: "Entradas",
    color: "#22c55e",
  },
  despesas: {
    label: "Saídas",
    color: "#ef4444",
  }
} satisfies ChartConfig;

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

interface GraficoColunasProps {
  filtro?: Partial<FiltroResumoAnual>;
}

export default function GraficoColunas({ filtro }: GraficoColunasProps) {
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getUTCFullYear());
  const [editandoAno, setEditandoAno] = useState(false);
  const [inputAno, setInputAno] = useState(anoSelecionado.toString());

  const { resumoAnual, carregandoAnual, fetchResumoAnual } = useResumoTransacoes();

  const contaId = filtro?.contaId;
  const categoriaId = filtro?.categoriaId;
  const tipo = filtro?.tipo;

  useEffect(() => {
    fetchResumoAnual({ 
      ano: anoSelecionado, 
      contaId, 
      categoriaId, 
      tipo 
    });
    setInputAno(anoSelecionado.toString()); 
  }, [anoSelecionado, contaId, categoriaId, tipo, fetchResumoAnual]);

  const confirmarAno = () => {
    const novoAno = parseInt(inputAno, 10);
    if (!isNaN(novoAno) && novoAno > 1900 && novoAno < 2100) {
      setAnoSelecionado(novoAno);
    } else {
      setInputAno(anoSelecionado.toString()); 
    }
    setEditandoAno(false);
  };

  // =========================
  // DADOS DO GRÁFICO
  // =========================
  const dadosDoGrafico = useMemo(() => {
    // Se estiver carregando ou se a API ainda não devolveu nada,
    // renderiza a estrutura com valores zerados para manter o layout fixo.
    if (carregandoAnual || !resumoAnual || resumoAnual.length === 0) {
      return meses.map((mes) => ({
        mes,
        receitas: 0,
        despesas: 0,
      }));
    }

    return resumoAnual.map((item, index) => ({
      mes: meses[index],
      receitas: item.receitas,
      despesas: item.despesas,
    }));
  }, [resumoAnual, carregandoAnual]);

  return (
    <div className="w-full p-2 sm:p-4">
      {/* SELETOR DE ANO INTERATIVO */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAnoSelecionado((prev) => prev - 1)}
            disabled={carregandoAnual || editandoAno}
            className="rounded-lg border border-[var(--border-color)] p-1.5 transition hover:bg-[var(--bg-secondary)] disabled:cursor-not-allowed disabled:opacity-40 text-[var(--text-primary)]"
          >
            <ChevronLeft size={16} />
          </button>

          {editandoAno ? (
            <input
              type="number"
              value={inputAno}
              onChange={(e) => setInputAno(e.target.value)}
              onBlur={confirmarAno} 
              onKeyDown={(e) => e.key === "Enter" && confirmarAno()} 
              autoFocus
              className="w-[60px] text-center text-sm font-medium border-b-2 border-[var(--primary-color)] bg-transparent text-[var(--text-primary)] outline-none"
            />
          ) : (
            <span
              onClick={() => setEditandoAno(true)}
              title="Clique para digitar o ano"
              className="min-w-[60px] text-center text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:text-[var(--primary-color)] transition-colors"
            >
              {anoSelecionado}
            </span>
          )}

          <button
            onClick={() => setAnoSelecionado((prev) => prev + 1)}
            disabled={carregandoAnual || editandoAno}
            className="rounded-lg border border-[var(--border-color)] p-1.5 transition hover:bg-[var(--bg-secondary)] disabled:cursor-not-allowed disabled:opacity-40 text-[var(--text-primary)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO*/}
      <div className="h-[280px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosDoGrafico}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-[var(--border-color)] opacity-50"
              />

              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs font-medium"
                stroke="var(--text-muted)"
              />

              <YAxis
                domain={[0, 'auto']}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-[10px] sm:text-xs font-medium"
                stroke="var(--text-muted)"
                width={65}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    notation: "compact",
                    compactDisplay: "short",
                    style: "currency",
                    currency: "BRL",
                  }).format(value)
                }
              />

              <ChartTooltip
                cursor={{ fill: "var(--bg-secondary)", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] shadow-lg"
                  />
                }
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="receitas"
                fill="var(--color-receitas)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="despesas"
                fill="var(--color-despesas)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}