import { useState, useEffect } from "react";
import { Meta } from "@/interfaces/Meta";
import { useModalStore } from "@/store/useModalStore";

export function useMetas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [criandoMeta, setCriandoMeta] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  const [adicionandoProgressoId, setAdicionandoProgressoId] = useState<number | null>(null);
  const [resgatandoProgressoId, setResgatandoProgressoId] = useState<number | null>(null); // NOVO ESTADO
  
  const { atualizarGatilho, triggerUpdate } = useModalStore();

  const carregarMetas = async () => {
    try {
      const res = await fetch("/api/meta");

      if (!res.ok) {
        throw new Error("Falha ao buscar as metas do banco de dados.");
      }

      const data = await res.json();
      setMetas(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMetas();
  }, [atualizarGatilho]);

  const createMeta = async (formData: {
    nome: string;
    descricao: string;
    valorAlvo: string;
    valorAtual?: string;
    dataLimite: string;
  }) => {
    setCriandoMeta(true);

    try {
      const metaData = {
        nome: formData.nome,
        descricao: formData.descricao,
        valorAlvo: parseFloat(formData.valorAlvo),
        valorAtual: formData.valorAtual ? parseFloat(formData.valorAtual) : 0, 
        dataLimite: formData.dataLimite || null,
      };

      const response = await fetch("/api/meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao criar meta");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setCriandoMeta(false);
    }
  };

  const updateMeta = async (
    metaId: number,
    formData: {
      nome: string;
      descricao: string;
      valorAlvo: string;
      valorAtual: string;
      dataLimite: string;
    }
  ) => {
    setAtualizandoId(metaId);

    try {
      const metaData = {
        nome: formData.nome,
        descricao: formData.descricao,
        valorAlvo: parseFloat(formData.valorAlvo),
        valorAtual: parseFloat(formData.valorAtual),
        dataLimite: formData.dataLimite || null,
      };

      const response = await fetch(`/api/meta/${metaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar meta");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setAtualizandoId(null);
    }
  };

  // ==========================================================
  // ADICIONAR PROGRESSO NA META (PATCH)
  // ==========================================================
  const adicionarProgresso = async (metaId: number, valor: number, contaId: number) => {
    setAdicionandoProgressoId(metaId);

    try {
      const response = await fetch(`/api/meta/${metaId}/progresso`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valor, contaId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao adicionar dinheiro na meta");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setAdicionandoProgressoId(null);
    }
  };

  // ==========================================================
  // NOVA FUNÇÃO: RESGATAR PROGRESSO DA META (PATCH)
  // ==========================================================
  const resgatarProgresso = async (metaId: number, valor: number, contaId: number) => {
    setResgatandoProgressoId(metaId);

    try {
      const response = await fetch(`/api/meta/${metaId}/resgate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valor, contaId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao resgatar dinheiro da meta");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setResgatandoProgressoId(null);
    }
  };

  const deletarMeta = async (metaId: number) => {
    const confirmar = confirm(
      "Tem certeza que deseja deletar esta meta?"
    );

    if (!confirmar) {
      return;
    }

    setDeletandoId(metaId);

    try {
      const response = await fetch(`/api/meta/${metaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao deletar meta");
      }

      setMetas((prev) => prev.filter((m) => m.id !== metaId));

      triggerUpdate();
    } catch (error) {
      console.error("Erro ao deletar meta:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao deletar meta"
      );
    } finally {
      setDeletandoId(null);
    }
  };

    const calcularProgresso = (atual: number, limite: number) => {
    if (limite === 0) return 0;
    return Math.min((atual / limite) * 100, 100);
  };


  return {
    metas,
    carregando,
    erro,
    createMeta,
    updateMeta,
    deletarMeta,
    adicionarProgresso,
    resgatarProgresso, 
    calcularProgresso,
    deletandoId,
    criandoMeta,
    atualizandoId,
    adicionandoProgressoId,
    resgatandoProgressoId
  };
}