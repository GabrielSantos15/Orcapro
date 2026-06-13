import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";

export interface FiltroTransacao {
  categoriaId?: number;
  contaId?: number;
  tipo?: "ENTRADA" | "SAIDA";
  dataInicio?: string;
  dataFim?: string;
}

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [criandoTransacao, setCriandoTransacao] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  const { atualizarGatilho, triggerUpdate } = useModalStore();

  const carregarTransacoes = async (filtros?: FiltroTransacao) => {
    setCarregando(true);
    setErro(null);

    try {
      const params = new URLSearchParams();

      if (filtros?.categoriaId) {
        params.set("categoriaId", filtros.categoriaId.toString());
      }

      if (filtros?.contaId) {
        params.set("contaId", filtros.contaId.toString());
      }

      if (filtros?.tipo) {
        params.set("tipo", filtros.tipo);
      }

      if (filtros?.dataInicio) {
        params.set("dataInicio", filtros.dataInicio);
      }

      if (filtros?.dataFim) {
        params.set("dataFim", filtros.dataFim);
      }

      const query = params.toString();

      const res = await fetch(`/api/transacao${query ? `?${query}` : ""}`);

      if (!res.ok) {
        throw new Error("Falha ao buscar as transações.");
      }

      const data = await res.json();

      setTransacoes(data);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar transações");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, [atualizarGatilho]);

  const createTransacao = async (formData: {
    tipo: string;
    contaId: string;
    categoriaId: string;
    origemDestino: string;
    descricao: string;
    valor: string;
    dataTransacao: string;
  }) => {
    setCriandoTransacao(true);

    try {
      const transacaoData = {
        tipo: formData.tipo,
        conta: { id: formData.contaId },
        categoria: { id: formData.categoriaId },
        origemDestino: formData.origemDestino,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        dataTransacao: formData.dataTransacao,
      };

      const response = await fetch("/api/transacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacaoData),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.error || "Falha ao criar transação");
      }

      triggerUpdate();

      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setCriandoTransacao(false);
    }
  };

  const updateTransacao = async (
    transacaoId: number,
    formData: {
      tipo: string;
      contaId: string;
      categoriaId: string;
      origemDestino: string;
      descricao: string;
      valor: string;
      dataTransacao: string;
    },
  ) => {
    setAtualizandoId(transacaoId);

    try {
      const transacaoData = {
        tipo: formData.tipo,
        conta: { id: formData.contaId },
        categoria: { id: formData.categoriaId },
        origemDestino: formData.origemDestino,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        dataTransacao: formData.dataTransacao,
      };

      const response = await fetch(`/api/transacao/${transacaoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacaoData),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.error || "Falha ao atualizar transação");
      }

      triggerUpdate();

      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setAtualizandoId(null);
    }
  };

  const deletarTransacao = async (transacaoId: number) => {
    const confirmar = confirm("Tem certeza que deseja deletar esta transação?");

    if (!confirmar) return;

    setDeletandoId(transacaoId);

    try {
      const response = await fetch(`/api/transacao/${transacaoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Erro ao deletar transação");
      }

      setTransacoes((prev) => prev.filter((t) => t.id !== transacaoId));

      triggerUpdate();
    } catch (error) {
      console.error("Erro ao deletar transação:", error);

      alert(
        error instanceof Error ? error.message : "Erro ao deletar transação",
      );
    } finally {
      setDeletandoId(null);
    }
  };

  return {
    transacoes,
    carregando,
    erro,
    carregarTransacoes,
    deletarTransacao,
    deletandoId,
    createTransacao,
    criandoTransacao,
    updateTransacao,
    atualizandoId,
  };
}
