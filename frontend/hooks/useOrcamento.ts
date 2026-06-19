import { useState, useEffect, useCallback } from "react";
import { Orcamento } from "@/interfaces/Orcamento";
import { useModalStore } from "@/store/useModalStore";


export function useOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const { atualizarGatilho, triggerUpdate } = useModalStore();

  const fetchOrcamentos = async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/orcamento");

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao buscar orçamentos");
      }

      const data = await res.json();
      setOrcamentos(data);
      setErro(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const criarOrcamento = async (dados: { categoriaId: number; limite: number }) => {
    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao criar orçamento");
      }

      const novoOrcamento = await res.json();
      setOrcamentos([...orcamentos, novoOrcamento]);
      triggerUpdate(); 
      return novoOrcamento;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  const updateOrcamento = async (
    id: number,
    dados: { categoriaId: number; limite: number }
  ) => {
    try {
      const res = await fetch(`/api/orcamento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao atualizar orçamento");
      }

      const orcamentoAtualizado = await res.json();
      setOrcamentos(
        orcamentos.map((orc) => (orc.id === id ? orcamentoAtualizado : orc))
      );
      triggerUpdate();
      return orcamentoAtualizado;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  const deletarOrcamento = async (id: number) => {
    try {
      const res = await fetch(`/api/orcamento/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao deletar orçamento");
      }

      setOrcamentos(orcamentos.filter((orc) => orc.id !== id));
      triggerUpdate();
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, [atualizarGatilho]);

  return {
    orcamentos,
    carregando,
    erro,
    criarOrcamento,
    updateOrcamento, 
    deletarOrcamento,
    recarregar: fetchOrcamentos,
  };
}