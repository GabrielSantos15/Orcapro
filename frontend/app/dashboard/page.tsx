"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useModalStore } from "@/store/useModalStore";
import { useContas } from "@/hooks/useContas";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import CardResumo from "@/components/cards/CardResumo";
import Button from "@/components/button/Button";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import ListaContas from "@/components/widgets/ListaContas";
import GraficoColunas from "@/components/charts/GraficoColunas";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { useEffect } from "react";
import { obterDatasMesAtual } from "@/lib/utils";
import ListaResumoMetas from "@/components/widgets/ListaResumoMetas";
import styles from "./Dashboard.module.css";

export default function DashBoardPage() {
  const { openModal, atualizarGatilho } = useModalStore();
  const { resumo, carregarResumo, carregando } = useResumoTransacoes();
  const { investimentos, carregando: carregandoInvestimentos } = useInvestimentos();
  const { contas, carregando: carregandoContas } = useContas();

  const totalInvestido = investimentos.reduce(
    (acc, inv) => acc + (inv.valorInvestido || 0),
    0,
  );
  const totalConta = contas.reduce(
    (acc, con) => acc + (con.saldo || 0),
    0,
  );

  useEffect(() => {
    const filtroMesAtual = obterDatasMesAtual();
    carregarResumo(filtroMesAtual);
  }, [atualizarGatilho]);

  return (
    <>
      <HeaderDashboard showWelcome={true} />
      <div className={styles.dashboardGrid}>
        <section className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 [grid-area:resumo]">
          <CardResumo value={totalConta} isLoading={carregandoContas} title="Saldo Total" variant="highlight" />
          <CardResumo value={resumo.receitas} isLoading={carregando} title="Entradas" color="var(--color-receita)" icon={ArrowUp} />
          <CardResumo value={resumo.despesas} isLoading={carregando} title="Saídas" color="var(--color-despesa)" icon={ArrowDown} />
          <CardResumo value={totalInvestido} isLoading={carregandoInvestimentos} title="Investido" color="var(--color-info)" />
        </section>

        <section className="md:hidden flex flex-col gap-4 [grid-area:resumo]">
          <CardResumo value={totalConta} isLoading={carregandoContas} title="Saldo Total" variant="highlight" />
          <Button
            className="md:hidden"
            onClick={() => openModal("createTransacao")}
          >
            + Adicionar Transação
          </Button>
          <div className="flex justify-between gap-4">
            <CardResumo value={resumo.receitas} isLoading={carregando} title="Entradas" color="var(--color-receita)" icon={ArrowUp} />
            <CardResumo value={resumo.despesas} isLoading={carregando} title="Saídas" color="var(--color-despesa)" icon={ArrowDown} />
          </div>
          <CardResumo value={totalInvestido} isLoading={carregandoInvestimentos} title="Investido" color="var(--color-info)" />
        </section>

        <WidgetContainer
          titulo="Contas"
          headerAction={
            <button
              onClick={() => openModal("createConta")}
              className="flex items-center gap-1 text-sm text-[var(--primary-color)] hover:text-white bg-[var(--primary-color)]/10 hover:bg-[var(--primary-color)] px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
            >
              + Adicionar
            </button>
          }
          className="[grid-area:contas] light-effect-subtle"
        >
          <ListaContas />
        </WidgetContainer>

        <WidgetContainer
          titulo="Entradas vs Saídas"
          subtitulo="Acompanhamento ao longo do tempo"
          className="[grid-area:grafico] light-effect"
        >
          <GraficoColunas />
        </WidgetContainer>

        <WidgetContainer
          titulo="Transações"
          headerAction={
            <button
              onClick={() => openModal("createTransacao")}
              className="flex items-center gap-1 text-sm text-[var(--primary-color)] hover:text-white bg-[var(--primary-color)]/10 hover:bg-[var(--primary-color)] px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l14 0" />
              </svg>
              Adicionar
            </button>
          }
          rodape={
            <Link
              href="/dashboard/movimentacao"
              className="w-full py-2 font-medium bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] transition-colors rounded-b-lg flex justify-center items-center"
            >
              Ver Todas
            </Link>
          }
          className="[grid-area:transacoes]"
        >
          <ListaTransacoes limite={5} />
        </WidgetContainer>

        <WidgetContainer
          titulo="Metas Próximas"
          rodape={
            <Link
              href="/dashboard/metas"
              className="w-full py-2 font-medium bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] transition-colors rounded-b-lg flex justify-center items-center"
            >
              Ver Todas
            </Link>
          }
          className="[grid-area:metas]"
        >
          <ListaResumoMetas></ListaResumoMetas>
        </WidgetContainer>
      </div>
    </>
  );
}