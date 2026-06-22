"use client";

import { useState, useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useOrcamentos } from "@/hooks/useOrcamento";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { obterDatasMesAtual, formatarMoeda } from "@/lib/utils"; 
import { AlertCircle, BarChart3 } from "lucide-react";

interface PainelLateralProps {
  filtro?: { dataInicio: string; dataFim: string };
}

export default function ListaGastosNaoPlanejados({ filtro }: PainelLateralProps) {
  const [abaAtiva, setAbaAtiva] = useState<"avisos" | "ranking">("avisos");
  
  const { openModal, atualizarGatilho } = useModalStore();
  const { orcamentos, fetchOrcamentos, carregando } = useOrcamentos();
  const { resumoCategorias, fetchResumoCategorias, carregandoCategoria } = useResumoTransacoes();

  useEffect(() => {
    fetchOrcamentos();
    const datas = filtro || obterDatasMesAtual();
    fetchResumoCategorias(datas.dataInicio, datas.dataFim);
  }, [filtro, atualizarGatilho, fetchOrcamentos]);

  const isLoading = carregando || carregandoCategoria;

  // Gastos Não Planejados (Avisos)
  const orcamentosIds = orcamentos.map((o) => o.categoria.id);
  const gastosSemOrcamento = resumoCategorias.filter(
    (r) => !orcamentosIds.includes(r.categoriaId) && r.totalGasto > 0
  );

  // Ranking Completo (Top Gastos)
  const rankingGastos = [...resumoCategorias]
    .filter((r) => r.tipoCategoria === "SAIDA" && r.totalGasto > 0)
    .sort((a, b) => b.totalGasto - a.totalGasto);

  // Calcula o total gasto no mês para fazer a barrinha de proporção no ranking
  const totalGastoMes = rankingGastos.reduce((acc, curr) => acc + curr.totalGasto, 0);

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm min-h-[300px]">
        <div className="w-full h-8 skeleton rounded-md mb-6" />
        <div className="space-y-4">
          <div className="w-full h-12 skeleton rounded-md" />
          <div className="w-full h-12 skeleton rounded-md" />
          <div className="w-full h-12 skeleton rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm h-fit sticky top-6 overflow-hidden">
      
      {/* HEADER: Navegação por Abas (Tabs) */}
      <div className="flex border-b border-[var(--border-color)]">
        <button
          onClick={() => setAbaAtiva("avisos")}
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
            abaAtiva === "avisos"
              ? "border-b-2 border-orange-500 text-orange-500 bg-orange-500/5"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <AlertCircle size={16} />
          <span className="relative">
            Avisos
            {gastosSemOrcamento.length > 0 && (
              <span className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </span>
        </button>

        <button
          onClick={() => setAbaAtiva("ranking")}
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
            abaAtiva === "ranking"
              ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--primary-color)]/5"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <BarChart3 size={16} />
          Ranking
        </button>
      </div>

      {/* BODY: Conteúdo Dinâmico */}
      <div className="p-6">
        
        {/* ABA 1: AVISOS */}
        {abaAtiva === "avisos" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {gastosSemOrcamento.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-muted)] text-sm">
                  Parabéns! Todos os seus gastos deste mês estão dentro do planejamento.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--text-muted)] mb-5 leading-relaxed">
                  Estas categorias tiveram movimentação neste período, mas não possuem um limite definido.
                </p>
                <div className="flex flex-col gap-4">
                  {gastosSemOrcamento.map((resumo) => (
                    <div key={resumo.categoriaId} className="flex justify-between items-center py-3 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[var(--text-primary)] text-sm">
                          {resumo.nomeCategoria}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${resumo.tipoCategoria === "ENTRADA" ? "text-green-500" : "text-[var(--text-primary)]"}`}>
                          {resumo.tipoCategoria === "ENTRADA" ? "+ " : "- "}
                          {formatarMoeda(resumo.totalGasto)}
                        </p>
                        {resumo.tipoCategoria === "SAIDA" && (
                          <button
                            onClick={() => openModal("createOrcamento")}
                            className="text-[10px] text-blue-500 font-bold uppercase hover:underline mt-1 cursor-pointer"
                          >
                            Criar Limite
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ABA 2: RANKING GERAL */}
        {abaAtiva === "ranking" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            {rankingGastos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-muted)] text-sm">Nenhum gasto registrado neste período.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {rankingGastos.map((resumo, index) => {
                  const percentualDoTotal = totalGastoMes > 0 ? (resumo.totalGasto / totalGastoMes) * 100 : 0;
                  
                  return (
                    <div key={resumo.categoriaId} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[var(--text-muted)] font-bold w-4">{index + 1}º</span>
                          <span className="font-medium text-[var(--text-primary)]">{resumo.nomeCategoria}</span>
                        </div>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {formatarMoeda(resumo.totalGasto)}
                        </span>
                      </div>
                      {/* Corrigido conflito do w-full, adicionado overflow-hidden e transition */}
                      <div className="bg-[var(--bg-secondary)] rounded-full h-1.5 ml-6 w-[calc(100%-24px)] overflow-hidden">
                        <div
                          className="bg-[var(--primary-color)] h-1.5 rounded-full opacity-70 transition-all duration-1000 ease-out"
                          style={{ width: `${percentualDoTotal}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}