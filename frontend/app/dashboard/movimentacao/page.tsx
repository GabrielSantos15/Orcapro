"use client";

import Button from "@/components/button/Button";
import CardResumo from "@/components/cards/CardResumo";
import GraficoColunas from "@/components/charts/GraficoColunas";
import GraficoTopCategorias from "@/components/charts/GraficoTopCategorias";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaCategorias from "@/components/widgets/ListaCategorias";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useModalStore } from "@/store/useModalStore";

export default function Movimentacao() {
  const { openModal } = useModalStore();
  const {
    transacoes,
    obterTotalReceitasMes,
    obterTotalDespesasMes,
  } = useTransacoes();
  const { categorias } = useCategorias();
  const { contas } = useContas();

  const saldoTotal = contas.reduce((acc, conta) => acc + (conta.saldo || 0), 0);
  const totalReceita = obterTotalReceitasMes();
  const totalDespesa = obterTotalDespesasMes();

  return (
    <div className="p-1 sm:p-3 xl:p-4">
      <div>
        <HeaderDashboard title="Minhas Movimentações" />
        <Button
          className="w-full md:w-fit mb-4"
          onClick={() => openModal("createTransacao")}
        >
          + Adicionar Transação
        </Button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <CardResumo value={saldoTotal} title="Saldo Total" color="primary" />
          <CardResumo value={totalReceita} title="Entradas" color="green" />
          <CardResumo value={totalDespesa} title="Saídas" color="red" />
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
        <div className="lg:col-span-3 ">
          <WidgetContainer titulo="Últimas Transações">
            <ListaTransacoes transacoes={transacoes} />
          </WidgetContainer>
        </div>

        <div className="lg:col-span-1">
          <WidgetContainer
            titulo="Categorias"
            subtitulo="Controle suas categorias"
            headerAction={
              <button
                onClick={() => openModal("createCategoria")}
                className="flex items-center gap-1 text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l14 0" />
                </svg>
                Adicionar
              </button>
            }
          >
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ListaCategorias categorias={categorias} />
            </div>
          </WidgetContainer>
        </div>
      </section>
    </div>
  );
}