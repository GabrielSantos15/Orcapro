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
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useMetas } from "@/hooks/useMetas";
import CardResumo from "@/components/cards/CardResumo";
import Button from "@/components/button/Button";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import ListaContas from "@/components/widgets/ListaContas";
import { MetaCard } from "@/components/cards/cardMeta";
import GraficoColunas from "@/components/charts/GraficoColunas";

export default function DashBoardPage() {
  const { contas } = useContas();
  const { transacoes, obterTotalReceitasMes, obterTotalDespesasMes } =
    useTransacoes();
  const { categorias } = useCategorias();
  const { investimentos } = useInvestimentos();
  const { metas } = useMetas();
  const { openModal } = useModalStore();

  //  5 metas mais próximas
  const metasProximas = metas
    .sort(
      (a, b) =>
        new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime(),
    )
    .slice(0, 5);

  const saldoTotal = contas.reduce((acc, conta) => acc + (conta.saldo || 0), 0);

  const totalReceita = obterTotalReceitasMes();
  const totalDespesa = obterTotalDespesasMes();

  const totalInvestido = investimentos.reduce(
    (acc, inv) => acc + (inv.valorInvestido || 0),
    0,
  );

  return (
    <div className="p-1 sm:p-3 xl:p-4">
      <Header showWelcome={true} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:col-span-3">
          <CardResumo value={saldoTotal} title="Saldo Total" color="primary" />
          <CardResumo value={totalReceita} title="Entradas" color="green" />
          <CardResumo value={totalDespesa} title="Saídas" color="red" />
          <CardResumo value={totalInvestido} title="Investido" color="blue" />
        </section>

        <section className="md:hidden flex flex-col gap-4">
          <CardResumo value={saldoTotal} title="Saldo Total" color="primary" />
          <Button
            className="md:hidden"
            onClick={() => openModal("createTransacao")}
          >
            + Adicionar Transação
          </Button>
          <div className="flex justify-between gap-4">
            <CardResumo value={totalReceita} title="Entradas" color="green" />
            <CardResumo value={totalDespesa} title="Saídas" color="red" />
          </div>
          <CardResumo value={totalInvestido} title="Investido" color="blue" />
        </section>

        <WidgetContainer
          titulo="Contas"
          headerAction={
            <button
              onClick={() => openModal("createConta")}
              className="flex items-center gap-1 text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
            >
              + Adicionar
            </button>
          }
          className="lg:col-span-1 lg:row-span-2"
        >
          <ListaContas contas={contas} />
        </WidgetContainer>

        <WidgetContainer
          titulo="Entradas vs Saídas"
          subtitulo="Acompanhamento ao longo do tempo"
          className="lg:col-span-2"
        >
          <GraficoColunas transacoes={transacoes} />
        </WidgetContainer>

        <WidgetContainer
          titulo="Transações"
          headerAction={
            <button
              onClick={() => openModal("createTransacao")}
              className="flex items-center gap-1 text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
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
              className="w-full py-2 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-b-lg flex justify-center items-center"
            >
              Ver Todas
            </Link>
          }
          className="lg:col-span-1"
        >
          <ListaTransacoes transacoes={transacoes.slice(0, 5)} />
        </WidgetContainer>

        <WidgetContainer
          titulo="Metas Próximas"
          rodape={
            <Link
              href="/dashboard/metas"
              className="w-full py-2 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-b-lg flex justify-center items-center"
            >
              Ver Todas
            </Link>
          }
          className="lg:col-span-4"
        >
          {metasProximas.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {metasProximas.map((meta) => (
                <div key={meta.id} className="flex-shrink-0">
                  <MetaCard
                    meta={{
                      id: meta.id,
                      nome: meta.nome,
                      descricao: meta.descricao,
                      valorAlvo: meta.valorAlvo,
                      valorAtual: meta.valorAtual,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhuma meta próxima
            </p>
          )}
        </WidgetContainer>
      </div>
    </div>
  );
}
