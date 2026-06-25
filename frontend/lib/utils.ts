import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatarDiaMes(dataISO: string | null | undefined) {
  if (!dataISO) return "--/--"; 

  const partes = dataISO.split("T");
  if (partes.length === 0) return "--/--";

  const [ano, mes, dia] = partes[0].split("-");
  return `${dia}/${mes}`;
}

export function formatarDiaMesAno(dataISO: string | null | undefined) {
  if (!dataISO) return "--/--/----";
  
  const partes = dataISO.split("T");
  if (partes.length === 0) return "--/--/----";
  
  const [ano, mes, dia] = partes[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export function obterDatasMesAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();

  const mes = String(hoje.getMonth() + 1).padStart(2, "0");

  const ultimoDiaObj = new Date(ano, hoje.getMonth() + 1, 0);
  const ultimoDia = String(ultimoDiaObj.getDate()).padStart(2, "0");

  return {
    dataInicio: `${ano}-${mes}-01`,
    dataFim: `${ano}-${mes}-${ultimoDia}`,
  };
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}
