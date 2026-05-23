"use client";

import { useMemo, useState } from "react";
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
import { Transacao } from "@/interfaces/Transacao";

interface GraficoColunasProps {
  transacoes: Transacao[];
}

const chartConfig = {
  receitas: {
    label: "Entradas",
    color: "#22c55e",
  },
  despesas: {
    label: "Saídas",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function GraficoColunas({ transacoes }: GraficoColunasProps) {
  // =========================
  // ANOS DISPONÍVEIS
  // =========================
  const anosDisponiveis = useMemo(() => {
    const anos = transacoes.map((t) =>
      new Date(t.dataTransacao).getUTCFullYear()
    );
    return [...new Set(anos)].sort((a, b) => a - b);
  }, [transacoes]);

  // =========================
  // ANO ATUAL
  // =========================
  const [anoSelecionado, setAnoSelecionado] = useState(
    anosDisponiveis[anosDisponiveis.length - 1] || new Date().getUTCFullYear()
  );

  // =========================
  // DADOS DO GRÁFICO
  // =========================
  const dadosDoGrafico = useMemo(() => {
    // Estrutura fixa dos 12 meses
    const dados = meses.map((mes) => ({
      mes,
      receitas: 0,
      despesas: 0,
    }));

    transacoes.forEach((transacao) => {
      // Ignora saldo inicial ou valores de abertura de conta
      if (
        transacao.origemDestino === "Saldo inicial" ||
        transacao.descricao?.includes("Valor inicial da conta")
      ) {
        return;
      }

      const data = new Date(transacao.dataTransacao);
      const ano = data.getUTCFullYear();

      // Filtra pelo ano selecionado
      if (ano !== anoSelecionado) {
        return;
      }

      const mesIndex = data.getUTCMonth();

      if (transacao.categoria?.tipo === "ENTRADA") {
        dados[mesIndex].receitas += transacao.valor;
      } else if (transacao.categoria?.tipo === "SAIDA") {
        dados[mesIndex].despesas += transacao.valor;
      }
    });

    return dados;
  }, [transacoes, anoSelecionado]);

  // =========================
  // CONTROLES DE PAGINAÇÃO
  // =========================
  const anoAtualIndex = anosDisponiveis.indexOf(anoSelecionado);
  const podeVoltar = anoAtualIndex > 0;
  const podeAvancar = anoAtualIndex < anosDisponiveis.length - 1;

  // =========================
  // EMPTY STATE
  // =========================
  const semDados = dadosDoGrafico.every(
    (item) => item.receitas === 0 && item.despesas === 0
  );

  return (
    <div className="w-full p-2 sm:p-4">
      
      {/* SELETOR DE ANO */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => podeVoltar && setAnoSelecionado(anosDisponiveis[anoAtualIndex - 1])}
            disabled={!podeVoltar}
            className="rounded-lg border p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-[60px] text-center text-sm font-medium text-gray-700">
            {anoSelecionado}
          </span>

          <button
            onClick={() => podeAvancar && setAnoSelecionado(anosDisponiveis[anoAtualIndex + 1])}
            disabled={!podeAvancar}
            className="rounded-lg border p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO */}
      <div className="h-[280px] w-full">
        {semDados ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
            <p className="text-sm text-gray-400">Nenhuma movimentação em {anoSelecionado}.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosDoGrafico}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />

                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs text-gray-500 font-medium"
                />

                {/* Novo Eixo Y com formatação compacta */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-[10px] sm:text-xs text-gray-500 font-medium"
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
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" className="bg-white border-none"/>}
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
        )}
      </div>
    </div>
  );
}