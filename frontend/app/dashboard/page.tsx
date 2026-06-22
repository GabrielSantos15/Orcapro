"use client";

import { Usuario } from "@/interfaces/Usuario";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/modal/Modal";
import { useModalStore } from "@/store/useModalStore";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useMetas } from "@/hooks/useMetas";
import CardResumo from "@/components/cards/CardResumo";
import Button from "@/components/button/Button";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import ListaContas from "@/components/widgets/ListaContas";
import { MetaCard } from "@/components/cards/cardMeta";
import GraficoColunas from "@/components/charts/GraficoColunas";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { useEffect } from "react";
import { obterDatasMesAtual } from "@/lib/utils";
import ListaResumoMetas from "@/components/widgets/ListaResumoMetas";

export default function DashBoardPage() {
  const { openModal , atualizarGatilho} = useModalStore();
  const { resumo, carregarResumo, carregando } = useResumoTransacoes();
  const { investimentos } = useInvestimentos();

  const totalInvestido = investimentos.reduce(
    (acc, inv) => acc + (inv.valorInvestido || 0),
    0,
  );

useEffect(() => {
    const filtroMesAtual = obterDatasMesAtual(); 
    carregarResumo(filtroMesAtual);
  }, [atualizarGatilho]);

  return (
    <>
      <HeaderDashboard showWelcome={true} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:col-span-3">
          <CardResumo
            value={resumo.saldo}
            title="Saldo Total"
            color="primary"
            isLoading={carregando}
          />
          <CardResumo value={resumo.receitas} isLoading={carregando} title="Entradas" color="green" />
          <CardResumo value={resumo.despesas} isLoading={carregando} title="Saídas" color="red" />
          <CardResumo value={totalInvestido} isLoading={carregando} title="Investido" color="blue" />
        </section>

        <section className="md:hidden flex flex-col gap-4">
          <CardResumo
            value={resumo.saldo}
            title="Saldo Total"
            color="primary"
            isLoading={carregando}
          />
          <Button
            className="md:hidden"
            onClick={() => openModal("createTransacao")}
          >
            + Adicionar Transação
          </Button>
          <div className="flex justify-between gap-4">
            <CardResumo
              value={resumo.receitas}
              title="Entradas"
              isLoading={carregando}
              color="green"
            />
            <CardResumo value={resumo.despesas} title="Saídas" color="red" isLoading={carregando}/>
          </div>
          <CardResumo value={totalInvestido} title="Investido" color="blue" isLoading={carregando}/>
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
          className="lg:col-span-1 lg:row-span-2"
        >
          <ListaContas />
        </WidgetContainer>

        <WidgetContainer
          titulo="Entradas vs Saídas"
          subtitulo="Acompanhamento ao longo do tempo"
          className="lg:col-span-2 dark:bg-gradient-to-br from-[var(--primary-color)]/30 from-20% to-[var(--bg-primary)] to-90% "
        >
          <GraficoColunas/>
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
              className="w-full py-2 font-mediu bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] transition-colors rounded-b-lg flex justify-center items-center"
            >
              Ver Todas
            </Link>
          }
          className="lg:col-span-1"
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
          className="lg:col-span-4"
        >
        <ListaResumoMetas ></ListaResumoMetas>
        </WidgetContainer>
      </div>
    </>
  );
}
