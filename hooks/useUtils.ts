"use client";

import { useCallback } from "react";

export function useUtils() {
  const formatarDiaMes = useCallback((dataISO: string) => {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
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
