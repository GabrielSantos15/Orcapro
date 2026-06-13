import { useEffect, useState } from "react";
import { FiltroTransacao } from "./useTransacoes";
import { useModalStore } from "@/store/useModalStore";

export interface ResumoTransacoes {
  receitas: number;
  despesas: number;
  saldo: number;
  quantidadeTransacoes: number;
}

export function useResumoTransacoes() {
  const [resumo, setResumo] = useState<ResumoTransacoes>({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    quantidadeTransacoes: 0,
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const { atualizarGatilho } = useModalStore();

  const carregarResumo = async (
    filtros?: FiltroTransacao
  ) => {
    setCarregando(true);
    setErro(null);

    try {
      const params = new URLSearchParams();

      if (filtros?.categoriaId) {
        params.set(
          "categoriaId",
          filtros.categoriaId.toString()
        );
      }

      if (filtros?.contaId) {
        params.set(
          "contaId",
          filtros.contaId.toString()
        );
      }

      if (filtros?.tipo) {
        params.set("tipo", filtros.tipo);
      }

      if (filtros?.dataInicio) {
        params.set(
          "dataInicio",
          filtros.dataInicio
        );
      }

      if (filtros?.dataFim) {
        params.set(
          "dataFim",
          filtros.dataFim
        );
      }

      const query = params.toString();

      const response = await fetch(
        `/api/transacao/resumo${
          query ? `?${query}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error(
          "Falha ao carregar resumo"
        );
      }

      const data = await response.json();

      setResumo({
        receitas: data.receitas ?? 0,
        despesas: data.despesas ?? 0,
        saldo: data.saldo ?? 0,
        quantidadeTransacoes:
          data.quantidadeTransacoes ?? 0,
      });

    } catch (err: any) {
      setErro(
        err.message ||
          "Erro ao carregar resumo"
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarResumo();
  }, [atualizarGatilho]);

  return {
    resumo,
    carregando,
    erro,
    carregarResumo,
  };
}