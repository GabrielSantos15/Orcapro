import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const { atualizarGatilho } = useModalStore();

  const carregarTransacoes = async () => {
    try {
      const token = localStorage.getItem("user_token");
      
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch("/api/transacao", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar as trasações do banco de dados.");
      }

      const data = await res.json();
      
      // Ordenar transações por data (mais recente primeiro)
      const transacoesOrdenadas = [...data].sort((a, b) => {
        return new Date(b.dataTransacao).getTime() - new Date(a.dataTransacao).getTime();
      });
      
      setTransacoes(transacoesOrdenadas);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, [atualizarGatilho]);

  const handleDelete = async (transacaoId: number) => {
    const confirmar = confirm(
      "Tem certeza que deseja deletar esta transação?"
    );

    if (!confirmar) {
      return;
    }

    setDeletandoId(transacaoId);

    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const response = await fetch(
        `/api/transacao/${transacaoId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || "Erro ao deletar transação"
        );
      }

      // Remove da lista sem recarregar página
      setTransacoes((prev) =>
        prev.filter((t) => t.id !== transacaoId)
      );

    } catch (error) {
      console.error("Erro ao deletar transação:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao deletar transação"
      );

    } finally {
      setDeletandoId(null);
    }
  };

  return { transacoes, loading, error, handleDelete, deletandoId };
}