'use client'

import { useEffect, useMemo } from "react";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useOrcamentos } from "@/hooks/useOrcamento";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "@/components/button/Button";
import { useModalStore } from "@/store/useModalStore";

export default function Orcamento() {
    const {
        orcamentos,
        carregando,
        deletarOrcamento,
        resumoCategorias,
        fetchResumoCategorias,
        carregandoResumo
    } = useOrcamentos();

    const { openModal } = useModalStore();

    // Dispara a busca do resumo das categorias para o mês atual assim que a tela abre
    useEffect(() => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth(); // 0 a 11

        // Formata para YYYY-MM-DD
        const primeiroDia = new Date(ano, mes, 1).toISOString().split('T')[0];
        const ultimoDia = new Date(ano, mes + 1, 0).toISOString().split('T')[0];

        fetchResumoCategorias(primeiroDia, ultimoDia);
    }, [fetchResumoCategorias]);

    // Função auxiliar para formatar moeda
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Estado consolidado de carregamento
    const isLoading = carregando || carregandoResumo;

    return (
        <main>
            <HeaderDashboard
                title="Orçamentos"
                subTitle="Controle seus limites de gastos mensais"
            />

            {/* Ações e Cabeçalho da Lista */}
            <div className="flex justify-between items-center mt-6 mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Meus Limites do Mês
                </h2>

                <Button
                    className="w-full md:w-fit mb-4"
                    onClick={() => openModal("createOrcamento")}
                >
                    + Adicionar Orçamento
                </Button>
            </div>
            {/* Grid de Orçamentos */}
            <div className="grid grid-cols-1 lg:grid grid-cols-3 gap-3 ">
                <section >
                    {resumoCategorias.map((r) => (
                        <div className="bg-[var(--bg-surface)] mb-4 p-5 border-l-5 border-[var(--primary-color)] ">
                            <h1 className="flex justify-between">{r.nomeCategoria}<span className="text-sm opacity-50">{r.quantidadeTransacoes}</span></h1>
                            <p className="text-sm">{r.tipoCategoria}: R${r.totalGasto}</p>
                        </div>
                    )
                    )}
                </section>
                <section className="col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-fit">
                    {isLoading ? (
                        <p className="text-[var(--text-muted)] animate-pulse col-span-full">
                            Carregando seus orçamentos e calculando gastos...
                        </p>
                    ) : orcamentos.length === 0 ? (
                        <div className="col-span-full p-10 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-sm">
                            <p className="text-[var(--text-muted)] mb-4">
                                Você ainda não definiu nenhum limite de gastos para suas categorias.
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
                            const resumo = resumoCategorias.find(r => r.categoriaId === orcamento.categoriaId);
                            const gastoReal = resumo ? resumo.totalGasto : 0;
                            const percentual = orcamento.limite > 0 ? (gastoReal / orcamento.limite) * 100 : 0;
                            // Lógica de Cores da Barra:
                            let corBarra = 'bg-[var(--primary-color)]';
                            if (percentual >= 100) {
                                corBarra = 'bg-[var(--danger-color)]';
                            } else if (percentual > 75) {
                                corBarra = 'bg-orange-500';
                            }
                            return (
                                <WidgetContainer key={orcamento.id} titulo={orcamento.categoriaNome}>
                                    <div className="p-5 flex flex-col gap-4">
                                        {/* Valores */}
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Gasto Atual</p>
                                                <p className={`text-2xl font-bold ${percentual > 100 ? 'text-[var(--danger-color)]' : 'text-[var(--text-primary)]'}`}>
                                                    {formatarMoeda(gastoReal)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Limite</p>
                                                <p className="text-sm font-medium text-[var(--text-secondary)]">
                                                    {formatarMoeda(orcamento.limite)}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Barra de Progresso */}
                                        <div>
                                            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-2.5 rounded-full ${corBarra} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${Math.min(percentual, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-right text-[var(--text-muted)] mt-2 font-medium">
                                                {percentual.toFixed(1)}% do limite
                                            </p>
                                        </div>
                                        {/* Ações */}
                                        <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-[var(--border-color)]">
                                            <button
                                                className="text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 text-sm"
                                                title="Editar orçamento"
                                            >
                                                <FiEdit2 size={16} /> Editar
                                            </button>
                                            <button
                                                onClick={() => deletarOrcamento(orcamento.id)}
                                                className="text-[var(--text-muted)] hover:text-[var(--danger-color)] transition-colors flex items-center gap-1 text-sm"
                                                title="Excluir orçamento"
                                            >
                                                <FiTrash2 size={16} /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                </WidgetContainer>
                            );
                        })
                    )}
                </section>
            </div>
        </main>
    );
}