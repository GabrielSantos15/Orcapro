"use client";

import { useCallback } from "react";

export function useUtils() {
  const formatarDiaMes = useCallback((dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    return `${dia}/${mes}`;
  }, []);

  const formatarMoeda = useCallback((valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }, []);

  return {
    formatarDiaMes,
    formatarMoeda,
  };
}
