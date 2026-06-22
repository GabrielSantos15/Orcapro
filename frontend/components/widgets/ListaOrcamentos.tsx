"use client";

import { useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { getIconeCategoria } from "@/lib/categoriaUtils";
import { useModalStore } from "@/store/useModalStore";
import { useOrcamentos } from "@/hooks/useOrcamento";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { formatarMoeda, obterDatasMesAtual } from "@/lib/utils";
import { TipoCategoria } from "@/interfaces/Categoria";

interface ListaOrcamentosProps {
  tipo: TipoCategoria;
  filtro?: { dataInicio: string; dataFim: string };
}

export default function ListaOrcamentos({ tipo, filtro }: ListaOrcamentosProps) {
  const { openModal, atualizarGatilho } = useModalStore();
  const isSaida = tipo === "SAIDA";

  const { orcamentos, carregando, deletarOrcamento, fetchOrcamentos } = useOrcamentos();
  const { resumoCategorias, fetchResumoCategorias, carregandoCategoria } = useResumoTransacoes();

  useEffect(() => {
    fetchOrcamentos(tipo);
    const datas = filtro || obterDatasMesAtual();
    fetchResumoCategorias(datas.dataInicio, datas.dataFim);
  }, [tipo, filtro, atualizarGatilho, fetchOrcamentos]);

  const isLoadingTotal = carregando || carregandoCategoria;

  if (isLoadingTotal) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm min-h-[180px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-end mb-4">
              <div className="w-1/2 h-10 skeleton rounded-md" />
              <div className="w-1/3 h-8 skeleton rounded-md" />
            </div>
            <div>
              <div className="w-full h-2.5 skeleton rounded-full mb-2" />
              <div className="w-24 h-3 skeleton rounded-md ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orcamentos.length === 0) {
    return (
      <div className="p-10 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-sm mb-12">
        <p className="text-[var(--text-muted)] mb-4">
          Você ainda não definiu nenhum(a) {isSaida ? "limite de gasto" : "meta de ganho"}.
        </p>
        <button
          onClick={() => openModal("createOrcamento")}
          className="text-[var(--primary-color)] font-medium hover:underline transition-all"
        >
          Criar meu primeiro {isSaida ? "orçamento" : "objetivo"}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12 p-5">
      {orcamentos.map((orcamento) => {
        const resumo = resumoCategorias.find(
          (r) => r.categoriaId === orcamento.categoria.id
        );
        const valorRealizado = resumo ? resumo.totalGasto : 0;
        const percentual = orcamento.limite > 0 ? (valorRealizado / orcamento.limite) * 100 : 0;

        let corBarra = "bg-[var(--primary-color)]";
        let corTextoMoeda = "text-[var(--text-primary)]";

        if (isSaida) {
          if (percentual >= 100) {
            corBarra = "bg-[var(--danger-color)]";
            corTextoMoeda = "text-[var(--danger-color)]";
          } else if (percentual > 75) corBarra = "bg-orange-500";
        } else {
          if (percentual >= 100) {
            corBarra = "bg-green-500";
            corTextoMoeda = "text-green-500";
          } else if (percentual > 50) corBarra = "bg-[var(--primary-color)]";
          else corBarra = "bg-orange-500";
        }

        return (
          <WidgetContainer
            key={orcamento.id}
            icon={getIconeCategoria(orcamento.categoria.nome)} 
            titulo={orcamento.categoria.nome} 
          >
            <div className="p-5 flex flex-col gap-4 h-full">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {isSaida ? "Gasto Atual" : "Ganho Atual"}
                  </p>
                  <p className={`text-2xl font-bold transition-colors ${corTextoMoeda}`}>
                    {formatarMoeda(valorRealizado)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {isSaida ? "Limite" : "Meta"}
                  </p>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    {formatarMoeda(orcamento.limite)}
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${corBarra} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(percentual, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-right text-[var(--text-muted)] mt-2 font-medium">
                  {percentual.toFixed(1)}% {isSaida ? "do limite" : "da meta"}
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={() => openModal("updateOrcamento", orcamento)}
                  className="text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 text-sm"
                >
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
      })}
    </div>
  );
}