'use client'

import { useState } from "react";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useOrcamentos } from "@/hooks/useOrcamento";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "@/components/button/Button";
import { useModalStore } from "@/store/useModalStore";

export default function Orcamento() {
    const { orcamentos, carregando, deletarOrcamento } = useOrcamentos();
      const { openModal } = useModalStore();

    // Função auxiliar para formatar moeda
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {carregando ? (
                    <p className="text-[var(--text-muted)] animate-pulse col-span-full">
                        Carregando seus orçamentos...
                    </p>
                ) : orcamentos.length === 0 ? (
                    <div className="col-span-full p-10 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
                        <p className="text-[var(--text-muted)] mb-4">
                            Você ainda não definiu nenhum limite de gastos.
                        </p>
                        <button
                            onClick={() => openModal("createOrcamento")}
                            className="text-[var(--primary-color)] font-medium hover:underline"
                        >
                            Criar meu primeiro orçamento
                        </button>
                    </div>
                ) : (
                    orcamentos.map((orcamento) => {
                        // MOCK: Simulando um gasto aleatório apenas para o esboço visual (será substituído pela soma real depois)
                        const gastoMock = orcamento.limite * (Math.random() * 1.2);
                        const percentual = (gastoMock / orcamento.limite) * 100;

                        // Lógica de Cores da Barra: Vermelho se passar de 80%, senão cor primária
                        const corBarra = percentual > 80
                            ? 'bg-[var(--danger-color)]'
                            : 'bg-[var(--primary-color)]';

                        return (
                            <WidgetContainer key={orcamento.id} titulo={orcamento.categoriaNome}>
                                <div className="p-5 flex flex-col gap-4">

                                    {/* Valores */}
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Gasto Atual</p>
                                            <p className={`text-2xl font-bold ${percentual > 100 ? 'text-[var(--danger-color)]' : 'text-[var(--text-primary)]'}`}>
                                                {formatarMoeda(gastoMock)}
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
            </div>
        </main>
    );
}