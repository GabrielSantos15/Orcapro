import { useState, useEffect, useCallback } from "react";
import { Orcamento } from "@/interfaces/Orcamento";
import { useModalStore } from "@/store/useModalStore";

// Interface para tipar o retorno do novo endpoint
export interface ResumoCategoria {
  categoriaId: number;
  nomeCategoria: string;
  tipoCategoria: "ENTRADA" | "SAIDA";
  totalGasto: number;
  quantidadeTransacoes: number;
}

export function useOrcamentos() {
  // Estados dos Orçamentos
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do Resumo de Categorias
  const [resumoCategorias, setResumoCategorias] = useState<ResumoCategoria[]>([]);
  const [carregandoResumo, setCarregandoResumo] = useState(false);

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

  // Nova função para buscar o resumo, otimizada com useCallback
  const fetchResumoCategorias = useCallback(async (dataInicio: string, dataFim: string) => {
    try {
      setCarregandoResumo(true);
      // Ajuste a rota abaixo caso o seu BFF esteja em uma pasta diferente
      const res = await fetch(`/api/transacao/resumo/categorias?dataInicio=${dataInicio}&dataFim=${dataFim}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao buscar resumo de categorias");
      }

      const data = await res.json();
      setResumoCategorias(data);
      console.log(resumoCategorias)
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregandoResumo(false);
    }
  }, []);

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
    resumoCategorias,
    carregando,
    carregandoResumo,
    erro,
    criarOrcamento,
    updateOrcamento, 
    deletarOrcamento,
    recarregar: fetchOrcamentos,
    fetchResumoCategorias, 
  };
}