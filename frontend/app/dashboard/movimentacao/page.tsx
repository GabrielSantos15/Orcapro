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
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function Movimentacao() {
  const { openModal, atualizarGatilho } = useModalStore();
  const [openFilters, setOpenFilters] = useState(false)

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
    setOpenFilters(false)
  };


  const handleClear = () => {
    const filtroResetado = obterDatasMesAtual();
    setFiltroRascunho(filtroResetado);
    setFiltroAplicado(filtroResetado);
    carregarTudo(filtroResetado);
    setOpenFilters(false)
  };

  return (
    <>
      <HeaderDashboard title="Minhas Movimentações" />
      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex-1 w-full lg:w-auto">
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all shadow-sm cursor-pointer"
          >
            <FaFilter size={14} className={openFilters ? "text-[var(--primary-color)]" : "text-[var(--text-muted)]"} />
            {openFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>

          <div
            className={`
                ${openFilters ? "block" : "hidden"} lg:block 
                mt-3 lg:mt-0 p-4 lg:p-0 
                bg-[var(--bg-surface)] lg:bg-transparent 
                border lg:border-0 border-[var(--border-color)] 
                rounded-xl shadow-sm lg:shadow-none
                animate-in fade-in slide-in-from-top-2 lg:animate-none
              `}
          >
            <FiltersTransacao
              categorias={categorias}
              contas={contas}
              filtro={filtroRascunho}
              setFiltro={setFiltroRascunho}
              onApply={handleApply}
              onClear={handleClear}
            />
          </div>
        </div>

        <Button
          className="w-full lg:w-auto shrink-0 shadow-sm"
          onClick={() => openModal("createTransacao")}
        >
          + Adicionar Transação
        </Button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <CardResumo value={resumo.saldo} isLoading={carregando} title="Fluxo de Caixa" color={resumo.saldo >= 0 ? "var(--color-receita)" : "var(--color-despesa)"} className="light-effect-subtle" />
          <CardResumo value={resumo.receitas} isLoading={carregando} title="Entradas" color="var(--color-receita)" icon={ArrowUp} />
          <CardResumo value={resumo.despesas} isLoading={carregando} title="Saídas" color="var(--color-despesa)" icon={ArrowDown} />
        </div>

        <div className="lg:col-span-2">
          <WidgetContainer
            titulo="Entradas vs Saídas"
            subtitulo="Acompanhamento ao longo do tempo"
            className="light-effect"
          >
            <GraficoColunas filtro={filtroAplicado} />
          </WidgetContainer>
        </div>

        <div className="lg:col-span-1">
          <WidgetContainer titulo="Maiores Gastos" subtitulo="Top 5 categorias" className="light-effect-subtle">
            <GraficoTopCategorias dataInicio={filtroAplicado.dataInicio} dataFim={filtroAplicado.dataFim} />
          </WidgetContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-4">
          <WidgetContainer titulo="Últimas Transações">
            <ListaTransacoes filtro={filtroAplicado} />
          </WidgetContainer>
        </div>
      </section>
    </>
  );
}