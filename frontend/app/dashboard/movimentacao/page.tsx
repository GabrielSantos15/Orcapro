"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/button/Button";
import CardResumo from "@/components/cards/CardResumo";
import GraficoColunas from "@/components/charts/GraficoColunas";
import GraficoTopCategorias from "@/components/charts/GraficoTopCategorias";
import FiltersTransacao from "@/components/filters/FiltersTransacao";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { useTransacoes } from "@/hooks/useTransacoes";
import { FiltroTransacao } from "@/hooks/useTransacoes";
import { obterDatasMesAtual } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";

export default function Movimentacao() {
  const { openModal, atualizarGatilho } = useModalStore();

  const { transacoes, carregarTransacoes } = useTransacoes();
  const { resumo, carregarResumo } = useResumoTransacoes();
  const { categorias } = useCategorias();
  const { contas } = useContas();

  const [filtro, setFiltro] = useState<FiltroTransacao>(obterDatasMesAtual);

  const filtroRef = useRef(filtro);
  filtroRef.current = filtro;

  const carregarTudo = (filtroAtual: FiltroTransacao) => {
    carregarTransacoes(filtroAtual);
    carregarResumo(filtroAtual);
  };

  useEffect(() => {
    carregarTudo(filtroRef.current);
  }, [atualizarGatilho]);

  const handleApply = () => carregarTudo(filtro);

  const handleClear = () => {
    const filtroResetado = obterDatasMesAtual();
    setFiltro(filtroResetado);
    carregarTudo(filtroResetado);
  };

  return (
    <>
      <div>
        <HeaderDashboard title="Minhas Movimentações" />
        <div className="flex justify-between items-center mb-4">
          <FiltersTransacao
            categorias={categorias}
            contas={contas}
            filtro={filtro}
            setFiltro={setFiltro}
            onApply={handleApply}
            onClear={handleClear}
          />
          <Button
            className="w-full md:w-fit"
            onClick={() => openModal("createTransacao")}
          >
            + Adicionar Transação
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <CardResumo
            value={resumo.saldo}
            title="Saldo Total"
            color="primary"
          />
          <CardResumo value={resumo.receitas} title="Entradas" color="green" />
          <CardResumo value={resumo.despesas} title="Saídas" color="red" />
        </div>

        <div className="lg:col-span-2">
          <WidgetContainer
            titulo="Entradas vs Saídas"
            subtitulo="Acompanhamento ao longo do tempo"
          >
            <GraficoColunas transacoes={transacoes} />
          </WidgetContainer>
        </div>

        <div className="lg:col-span-1">
          <WidgetContainer titulo="Maiores Gastos" subtitulo="Top 5 categorias">
            <GraficoTopCategorias transacoes={transacoes} />
          </WidgetContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-4">
          <WidgetContainer titulo="Últimas Transações">
            <ListaTransacoes transacoes={transacoes} />
          </WidgetContainer>
        </div>
      </section>
    </>
  );
}