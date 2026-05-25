"use client";

import GraficoColunas from "@/components/charts/GraficoColunas";
import Header from "@/components/header/Header";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useTransacoes } from "@/hooks/useTransacoes";

export default function Metas() {
  const { transacoes, deletarTransacao, deletandoId } = useTransacoes();

  function formatarDiaMes(dataISO: string) {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
  }
  return (
    <div className="p-1 sm:p-3 xl:p-4">
      <Header title="Minhas Movimentacoes" />
      <h1>Movimentações</h1>
      <WidgetContainer
        titulo="Entradas vs Saídas"
        subtitulo="Acompanhamento ao longo do tempo"
        className="lg:col-span-2"
      >
        <GraficoColunas transacoes={transacoes} />
      </WidgetContainer>
      <WidgetContainer titulo="Transações">
        <ListaTransacoes transacoes={transacoes.slice(0, 5)} />
      </WidgetContainer>
    </div>
  );
}
