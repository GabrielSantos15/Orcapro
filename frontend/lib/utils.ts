import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function obterDatasMesAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');

    const ultimoDiaObj = new Date(ano, hoje.getMonth() + 1, 0);
    const ultimoDia = String(ultimoDiaObj.getDate()).padStart(2, '0');

    return {
        dataInicio: `${ano}-${mes}-01`,
        dataFim: `${ano}-${mes}-${ultimoDia}`
    };
}