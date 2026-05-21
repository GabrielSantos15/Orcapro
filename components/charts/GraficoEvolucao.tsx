"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Transacao } from "@/interfaces/Transacao";
import { useEvolucaoSaldo } from "@/hooks/useEvolucaoSaldo";

interface GraficoEvolucaoProps {
  transacoes: Transacao[];
  saldoInicial?: number;
  titulo?: string;
  descricao?: string;
  altura?: string;
}

const chartConfig = {
  receita: {
    label: "Receitas",
    color: "#10b981",
  },
  despesa: {
    label: "Despesas",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export default function GraficoEvolucao({
  transacoes,
  saldoInicial = 0,
  altura = "h-[250px]",
}: GraficoEvolucaoProps) {
  const dados = useEvolucaoSaldo(transacoes, saldoInicial);

  if (dados.length === 0) {
    return (

        <div className={`${altura} w-full flex items-center justify-center text-gray-400`}>
          Sem transações para exibir
        </div>
    );
  }

  return (
      <ChartContainer config={chartConfig} className={`${altura} w-full`}>
        <AreaChart
          accessibilityLayer
          data={dados}
          margin={{ top: 10, left: -20, right: 10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#f3f4f6" />

          <XAxis
            dataKey="data"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs text-gray-400 font-medium"
          />

          <YAxis 
            tickLine={false} 
            axisLine={false} 
            className="text-xs text-gray-400 font-medium"
          />

          <ChartTooltip
            cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="dot" />}
          />

          <ChartLegend content={<ChartLegendContent />} />

          <Area
            dataKey="receita"
            type="monotone"
            stroke="var(--color-receita)"
            strokeWidth={3}
            fill="var(--color-receita)"
            fillOpacity={0.1}
          />

          <Area
            dataKey="despesa"
            type="monotone"
            stroke="var(--color-despesa)"
            strokeWidth={3}
            fill="var(--color-despesa)"
            fillOpacity={0.1}
          />
        </AreaChart>
      </ChartContainer>
  );
}