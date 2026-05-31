import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true); 
  const [erro, setErro] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [criandoTransacao, setCriandoTransacao] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const { atualizarGatilho, triggerUpdate } = useModalStore();

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
      setErro(err.message);
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
      const token = localStorage.getItem("user_token");
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

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
          Authorization: `Bearer ${token}`,
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
    }
  ) => {
    setAtualizandoId(transacaoId);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

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
          Authorization: `Bearer ${token}`,
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

      triggerUpdate();

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

  // Função para filtrar transações do mês atual por tipo
  const obterTransacoesMes = (tipo: "ENTRADA" | "SAIDA", data = new Date()) => {
    const mesAtual = data.getMonth();
    const anoAtual = data.getFullYear();

    return transacoes.filter((t) => {
      const dataTransacao = new Date(t.dataTransacao);
      return (
        t.categoria?.tipo === tipo &&
        dataTransacao.getMonth() === mesAtual &&
        dataTransacao.getFullYear() === anoAtual
      );
    });
  };

  // Função para obter total de despesas do mês
  const obterTotalDespesasMes = (data = new Date()) => {
    return obterTransacoesMes("SAIDA", data).reduce(
      (acc, t) => acc + (t.valor || 0),
      0
    );
  };

  // Função para obter total de receitas do mês
  const obterTotalReceitasMes = (data = new Date()) => {
    return obterTransacoesMes("ENTRADA", data).reduce(
      (acc, t) => acc + (t.valor || 0),
      0
    );
  };

  return { 
    transacoes, 
    carregando, 
    erro, 
    deletarTransacao, 
    deletandoId, 
    createTransacao, 
    criandoTransacao, 
    updateTransacao, 
    atualizandoId,
    obterTransacoesMes,
    obterTotalDespesasMes,
    obterTotalReceitasMes,
  };
}