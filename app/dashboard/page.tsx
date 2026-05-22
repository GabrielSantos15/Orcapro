"use client";

import { Usuario } from "@/interfaces/Usuario";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header/Header";
import Modal from "@/components/modal/Modal";
import { useModalStore } from "@/store/useModalStore";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";
import GraficoEvolucao from "@/components/charts/GraficoEvolucao";
import CardResumo from "@/components/cards/CardResumo";
import Button from "@/components/button/Button";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import ListaContas from "@/components/widgets/ListaContas";
import GraficoColunas from "@/components/charts/GraficoColunas";

export default function DashBoardPage() {
  const { contas } = useContas();
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();
  const { openModal } = useModalStore();

  const saldoTotal = contas.reduce((acc, conta) => acc + (conta.saldo || 0), 0);

  const totalReceita = transacoes
    .filter(
      (t) => t.categoria?.tipo === "RECEITA" && t.descricao !== "Saldo inicial",
    )
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const totalDespesa = transacoes
    .filter((t) => t.categoria?.tipo === "DESPESA")
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const transacoesGrafico = transacoes.filter(
    (t) => t.descricao !== "Saldo inicial",
  );

  return (
    <div className="p-1 sm:p-3 xl:p-4">
      <Header showWelcome={true} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4">
        <div>
          <p className="text-gray-600">filtros</p>
        </div>
        <Button onClick={() => openModal("createTransacao")}>
          + Adicionar Transação
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:col-span-3">
          <CardResumo value={saldoTotal} title="Saldo Total" color="primary" />
          <CardResumo value={totalReceita} title="Receitas" color="green" />
          <CardResumo value={totalDespesa} title="Despesas" color="red" />
          <CardResumo value={3000} title="Investido" color="blue" />
        </section>

        <WidgetContainer
          titulo="Contas"
          rodape={
            <button
              onClick={() => openModal("conta")}
              className="text-blue-600 hover:underline"
            >
              + Adicionar
            </button>
          }
          className="lg:col-span-1 lg:row-span-2"
        >
          <ListaContas contas={contas}/>
        </WidgetContainer>

        <WidgetContainer
          titulo="Receitas vs Despesas"
          subtitulo="Acompanhamento ao longo do tempo"
          className="lg:col-span-2"
        >
          <GraficoColunas transacoes={transacoes} />
        </WidgetContainer>

        <WidgetContainer
          titulo="Transações"
          rodape={
            <Link
              href="/dashboard/movimentacao"
              className="text-blue-600 hover:underline"
            >
              Ver Todas
            </Link>
          }
          className="lg:col-span-1"
        >
          <ListaTransacoes transacoes={transacoes.slice(0, 5)} />
        </WidgetContainer>
      </div>
    </div>
  );
}
