import { useState, useCallback, useEffect } from "react";
import { Orcamento, OrcamentoRequest } from "@/interfaces/Orcamento";
import { TipoCategoria } from "@/interfaces/Categoria"; 
import { useModalStore } from "@/store/useModalStore";

export function useOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const { triggerUpdate } = useModalStore();

  const fetchOrcamentos = useCallback(async (tipo?: TipoCategoria) => {
    try {
      setCarregando(true);

      const url = tipo ? `/api/orcamento?tipo=${tipo}` : "/api/orcamento";
      const res = await fetch(url);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao buscar orçamentos");
      }

      const data: Orcamento[] = await res.json();
      setOrcamentos(data);
      setErro(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarOrcamento = useCallback(async (dados: OrcamentoRequest) => {
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

      const novoOrcamento: Orcamento = await res.json();
      triggerUpdate(); 
      return novoOrcamento;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  }, [triggerUpdate]);

  const updateOrcamento = useCallback(async (id: number, dados: OrcamentoRequest) => {
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

      const orcamentoAtualizado: Orcamento = await res.json();
      triggerUpdate();
      return orcamentoAtualizado;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  }, [triggerUpdate]);

  const deletarOrcamento = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/orcamento/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao deletar orçamento");
      }

      triggerUpdate();
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  }, [triggerUpdate]);

  return {
    orcamentos,
    carregando,
    erro,
    criarOrcamento,
    updateOrcamento, 
    deletarOrcamento,
    fetchOrcamentos,
  };
}