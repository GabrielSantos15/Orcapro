"use client";

import Button from "@/components/button/Button";
import CardResumo from "@/components/cards/CardResumo";
import GraficoColunas from "@/components/charts/GraficoColunas";
import GraficoTopCategorias from "@/components/charts/GraficoTopCategorias";
import Filters from "@/components/filters/Filters";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaCategorias from "@/components/widgets/ListaCategorias";
import ListaTransacoes from "@/components/widgets/ListaTransacoes";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useModalStore } from "@/store/useModalStore";

export default function Movimentacao() {
  const { openModal } = useModalStore();

  const { transacoes, carregarTransacoes } = useTransacoes();
  const { resumo, carregarResumo } = useResumoTransacoes();
  const { categorias } = useCategorias();
  const { contas } = useContas();

  return (
    <>
      <div>
        <HeaderDashboard title="Minhas Movimentações" />
        <div className="flex justify-between items-center mb-4">
          <Button
            className="w-full md:w-fit"
            onClick={() => openModal("createTransacao")}
          >
            + Adicionar Transação
          </Button>
          <Filters
            categorias={categorias}
            contas={contas}
            onApply={(filtro) => {
              carregarTransacoes(filtro);
              carregarResumo(filtro);
            }}
          />
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
        <div className="lg:col-span-3">
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
          >
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ListaCategorias categorias={categorias} />
            </div>
          </WidgetContainer>
        </div>
      </section>
    </>
  );
}
