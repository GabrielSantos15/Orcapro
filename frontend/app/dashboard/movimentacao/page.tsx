"use client";

import { useEffect, useState } from "react";

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
import { obterDatasMesAtual } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";

export default function Movimentacao() {
  const { openModal, atualizarGatilho } = useModalStore();

  const { transacoes, carregarTransacoes } = useTransacoes();
  const { resumo, carregarResumo, carregando } = useResumoTransacoes();
  const { categorias } = useCategorias();
  const { contas } = useContas();


  const [filtroRascunho, setFiltroRascunho] = useState<FiltroTransacao>(() => obterDatasMesAtual());
  const [filtroAplicado, setFiltroAplicado] = useState<FiltroTransacao>(() => obterDatasMesAtual());

  const carregarTudo = (filtroAtual: FiltroTransacao) => {
    carregarTransacoes(filtroAtual);
    carregarResumo(filtroAtual);
  };


  useEffect(() => {
    carregarTudo(filtroAplicado);
  }, [atualizarGatilho]);


  const handleApply = () => {
    setFiltroAplicado(filtroRascunho); 
    carregarTudo(filtroRascunho);  
  };


  const handleClear = () => {
    const filtroResetado = obterDatasMesAtual();
    setFiltroRascunho(filtroResetado);
    setFiltroAplicado(filtroResetado);
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
            filtro={filtroRascunho}
            setFiltro={setFiltroRascunho}
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
            isLoading={carregando}
            title="Saldo Total"
            color="primary"
          />
          <CardResumo value={resumo.receitas} isLoading={carregando} title="Entradas" color="green" />
          <CardResumo value={resumo.despesas} isLoading={carregando} title="Saídas" color="red" />
        </div>

        <div className="lg:col-span-2">
          <WidgetContainer
            titulo="Entradas vs Saídas"
            subtitulo="Acompanhamento ao longo do tempo"
          >
            <GraficoColunas filtro={filtroAplicado} />
          </WidgetContainer>
        </div>

        <div className="lg:col-span-1">
          <WidgetContainer titulo="Maiores Gastos" subtitulo="Top 5 categorias">
            <GraficoTopCategorias dataInicio={filtroAplicado.dataInicio} dataFim={filtroAplicado.dataFim}/>
          </WidgetContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-4">
          <WidgetContainer titulo="Últimas Transações">
            <ListaTransacoes filtro={filtroAplicado}/>
          </WidgetContainer>
        </div>
      </section>
    </>
  );
}