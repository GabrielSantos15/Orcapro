"use client";

import { FiltroTransacao } from "@/interfaces/FiltroTransacao";
import { FaRotateLeft } from "react-icons/fa6"; 

interface FiltersOrcamentoProps {
    filtro: FiltroTransacao;
    setFiltro: React.Dispatch<React.SetStateAction<FiltroTransacao>>;
    onClear: () => void; 
}

export default function FiltersOrcamento({
    filtro,
    setFiltro,
    onClear,
}: FiltersOrcamentoProps) {

    const mesAnoAtual = filtro.dataInicio ? filtro.dataInicio.substring(0, 7) : "";

    const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value; 

        if (!valor) return;

        const [ano, mes] = valor.split("-");

        const ultimoDiaObj = new Date(Number(ano), Number(mes), 0);
        const ultimoDia = String(ultimoDiaObj.getDate()).padStart(2, "0");

        setFiltro((prev) => ({
            ...prev,
            dataInicio: `${ano}-${mes}-01`,
            dataFim: `${ano}-${mes}-${ultimoDia}`,
        }));
    };

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-lg bg-[var(--bg-surface)] lg:bg-transparent border lg:border-0 border-[var(--border-color)] p-3 lg:p-0">

            <div className="flex flex-col flex-1 min-w-[180px] sm:min-w-0 sm:flex-none">
                <label className="text-sm text-[var(--text-muted)] mb-1 whitespace-nowrap">
                    Mês de Referência
                </label>
                <input
                    type="month"
                    value={mesAnoAtual}
                    onChange={handleMesChange}
                    className="flex h-10 w-full sm:w-[200px] rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] transition-colors cursor-pointer"
                />
            </div>

            <div className="flex flex-1 sm:flex-none justify-end gap-2">
                <button
                    onClick={onClear}
                    className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 sm:px-5 hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)] transition-all duration-200 whitespace-nowrap"
                    title="Voltar para o mês atual"
                >
                    <FaRotateLeft />
                    Atual
                </button>
            </div>

        </div>
    );
}