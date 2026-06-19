'use client'

import { useEffect, useRef, useState } from "react";

import Button from "@/components/button/Button";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import FiltersOrcamento from "@/components/filters/FiltersOrcamento";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useOrcamentos } from "@/hooks/useOrcamento";
import { useModalStore } from "@/store/useModalStore";
import { obterDatasMesAtual } from "@/lib/utils";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getIconeCategoria } from "@/lib/categoriaUtils";

export default function Orcamento() {
  const {
    orcamentos,
    carregando,
    deletarOrcamento,
    resumoCategorias,
    fetchResumoCategorias,
    carregandoResumo,
  } = useOrcamentos();

  const { openModal, atualizarGatilho } = useModalStore();

  const [filtro, setFiltro] = useState<FiltroTransacao>(obterDatasMesAtual);

  const filtroRef = useRef(filtro);
  filtroRef.current = filtro;

  const carregarResumo = (filtroAtual: FiltroTransacao) => {
    if (filtroAtual.dataInicio && filtroAtual.dataFim) {
      fetchResumoCategorias(filtroAtual.dataInicio, filtroAtual.dataFim);
    }
  };

  // Dispara na montagem e quando um orçamento/transação é criado/deletado
  useEffect(() => {
    carregarResumo(filtroRef.current);
  }, [atualizarGatilho]);

  const handleApply = () => carregarResumo(filtro);

  const handleClear = () => {
    const filtroResetado = obterDatasMesAtual();
    setFiltro(filtroResetado);
    carregarResumo(filtroResetado);
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const isLoading = carregando || carregandoResumo;
  const orcamentosIds = orcamentos.map((o) => o.categoriaId);
  const gastosSemOrcamento = resumoCategorias.filter(
    (r) => !orcamentosIds.includes(r.categoriaId)
  );

  return (
    <main>
      <HeaderDashboard
        title="Orçamentos"
        subTitle="Controle seus limites de gastos mensais e visualize os excedentes"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="mt-6 mb-8">
          <FiltersOrcamento
            filtro={filtro}
            setFiltro={setFiltro}
            onApply={handleApply}
            onClear={handleClear}
          />
        </div>
        <Button
          className="w-full md:w-fit"
          onClick={() => openModal("createOrcamento")}
        >
          + Adicionar Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {isLoading ? (
          <p className="text-[var(--text-muted)] animate-pulse col-span-full">
            Carregando seus orçamentos e calculando gastos...
          </p>
        ) : orcamentos.length === 0 ? (
          <div className="col-span-full p-10 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-sm">
            <p className="text-[var(--text-muted)] mb-4">
              Você ainda não definiu nenhum limite de gastos.
            </p>
            <button
              onClick={() => openModal("createOrcamento")}
              className="text-[var(--primary-color)] font-medium hover:underline transition-all"
            >
              Criar meu primeiro orçamento
            </button>
          </div>
        ) : (
          orcamentos.map((orcamento) => {
            const resumo = resumoCategorias.find(
              (r) => r.categoriaId === orcamento.categoriaId
            );
            const gastoReal = resumo ? resumo.totalGasto : 0;
            const percentual =
              orcamento.limite > 0 ? (gastoReal / orcamento.limite) * 100 : 0;

            let corBarra = "bg-[var(--primary-color)]";
            if (percentual >= 100) corBarra = "bg-[var(--danger-color)]";
            else if (percentual > 75) corBarra = "bg-orange-500";

            return (
              <WidgetContainer icon={getIconeCategoria(orcamento.categoriaNome)} key={orcamento.id} titulo={orcamento.categoriaNome}>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                        Gasto Atual
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          percentual > 100
                            ? "text-[var(--danger-color)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        {formatarMoeda(gastoReal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                        Limite
                      </p>
                      <p className="text-sm font-medium text-[var(--text-secondary)]">
                        {formatarMoeda(orcamento.limite)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${corBarra} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(percentual, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-right text-[var(--text-muted)] mt-2 font-medium">
                      {percentual.toFixed(1)}% do limite
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-[var(--border-color)]">
                    <button className="text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 text-sm">
                      <FiEdit2 size={16} /> Editar
                    </button>
                    <button
                      onClick={() => deletarOrcamento(orcamento.id)}
                      className="text-[var(--text-muted)] hover:text-[var(--danger-color)] transition-colors flex items-center gap-1 text-sm"
                    >
                      <FiTrash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              </WidgetContainer>
            );
          })
        )}
      </div>

      {!isLoading && gastosSemOrcamento.length > 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Outros Gastos do Mês
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Estas categorias tiveram movimentação neste período, mas ainda não
            possuem um orçamento definido.
          </p>

          <div className="flex flex-col gap-4">
            {gastosSemOrcamento.map((resumo) => (
              <div
                key={resumo.categoriaId}
                className="flex justify-between items-center py-3 border-b border-[var(--border-color)] last:border-0"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {resumo.nomeCategoria}
                  </p>
                  {resumo.quantidadeTransacoes && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {resumo.quantidadeTransacoes}{" "}
                      {resumo.quantidadeTransacoes === 1 ? "transação" : "transações"}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      resumo.tipoCategoria === "ENTRADA"
                        ? "text-green-600"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {resumo.tipoCategoria === "ENTRADA" ? "+ " : "- "}
                    {formatarMoeda(resumo.totalGasto)}
                  </p>
                  {resumo.tipoCategoria === "SAIDA" && (
                    <button
                      onClick={() => openModal("createOrcamento")}
                      className="text-xs text-[var(--primary-color)] font-medium hover:underline mt-1"
                    >
                      Criar Limite
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}