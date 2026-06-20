
"use client";

import { FiltroTransacao } from "@/interfaces/FiltroTransacao";
import { FaFilterCircleXmark } from "react-icons/fa6";

interface FiltersOrcamentoProps {
    filtro: FiltroTransacao;
    setFiltro: React.Dispatch<React.SetStateAction<FiltroTransacao>>;
    onApply: () => void;
    onClear: () => void;
}

export default function FiltersOrcamento({
    filtro,
    setFiltro,
    onApply,
    onClear,
}: FiltersOrcamentoProps) {

    // Extrai apenas a parte "YYYY-MM" do dataInicio para o input nativo entender
    const mesAnoAtual = filtro.dataInicio ? filtro.dataInicio.substring(0, 7) : "";

    const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value; // O input retorna no formato "YYYY-MM"

        if (!valor) return;

        const [ano, mes] = valor.split("-");

        // Calcula o último dia do mês selecionado dinamicamente
        const ultimoDiaObj = new Date(Number(ano), Number(mes), 0);
        const ultimoDia = String(ultimoDiaObj.getDate()).padStart(2, "0");

        // Alimenta o state mantendo a compatibilidade com a API
        setFiltro((prev) => ({
            ...prev,
            dataInicio: `${ano}-${mes}-01`,
            dataFim: `${ano}-${mes}-${ultimoDia}`,
        }));
    };

    return (
        <div className="rounded-lg flex flex-wrap gap-2 items-end">

            {/* Seletor de Mês/Ano */}
            <div className="flex flex-col">
                <label className="text-sm text-[var(--text-primary)] mb-1">
                    Mês de Referência
                </label>
                <input
                    type="month"
                    value={mesAnoAtual}
                    onChange={handleMesChange}
                    className="flex h-10 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] min-w-[150px]"
                />
            </div>

            {/* Ações */}
            <button
                onClick={onApply}
                className="flex h-10 items-center justify-center cursor-pointer font-medium bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white rounded-md px-4 transition-colors"
            >
                Buscar
            </button>

            <button
                onClick={onClear}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-color)] px-4 hover:text-[var(--primary-color)] transition-colors"
                title="Voltar para o mês atual"
            >
                <FaFilterCircleXmark />
                Mês Atual
            </button>
        </div>
    );
}