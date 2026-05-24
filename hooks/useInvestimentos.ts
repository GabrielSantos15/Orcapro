import { useState, useEffect } from "react";
import { Investimento } from "@/interfaces/Investimento";
import { useModalStore } from "@/store/useModalStore";

export function useInvestimentos() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [criandoInvestimento, setCriandoInvestimento] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [aporteEmProgresso, setAporteEmProgresso] = useState(false);
  const [resgateEmProgresso, setResgateEmProgresso] = useState(false);
  const { atualizarGatilho, triggerUpdate } = useModalStore();

  const carregarInvestimentos = async () => {
    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch("/api/investimento", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar os investimentos do banco de dados.");
      }

      const data = await res.json();

      // Ordenar investimentos por data (mais recente primeiro)
      const investimentosOrdenados = [...data].sort((a, b) => {
        return (
          new Date(b.dataAplicacao).getTime() -
          new Date(a.dataAplicacao).getTime()
        );
      });

      setInvestimentos(investimentosOrdenados);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarInvestimentos();
  }, [atualizarGatilho]);

  const createInvestimento = async (formData: {
    contaId: string;
    tipo: string;
    valorInvestido: string;
    percentual: string;
    indicador: string;
    dataAplicacao: string;
  }) => {
    setCriandoInvestimento(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const investimentoData = {
        conta: { id: formData.contaId },
        tipo: formData.tipo,
        valorInvestido: parseFloat(formData.valorInvestido),
        percentual: parseFloat(formData.percentual),
        indicador: formData.indicador,
        dataAplicacao: formData.dataAplicacao,
        ativo: true,
        status: 1,
      };

      const response = await fetch("/api/investimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(investimentoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao criar investimento");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setCriandoInvestimento(false);
    }
  };

  const updateInvestimento = async (
    investimentoId: number,
    formData: {
      contaId: string;
      tipo: string;
      valorInvestido: string;
      percentual: string;
      indicador: string;
      dataAplicacao: string;
      ativo: boolean;
      status: number;
    }
  ) => {
    setAtualizandoId(investimentoId);

    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const investimentoData = {
        conta: { id: formData.contaId },
        tipo: formData.tipo,
        valorInvestido: parseFloat(formData.valorInvestido),
        percentual: parseFloat(formData.percentual),
        indicador: formData.indicador,
        dataAplicacao: formData.dataAplicacao,
        ativo: formData.ativo,
        status: formData.status,
      };

      const response = await fetch(`/api/investimento/${investimentoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(investimentoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar investimento");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setAtualizandoId(null);
    }
  };

  const deletarInvestimento = async (investimentoId: number) => {
    const confirmar = confirm(
      "Tem certeza que deseja excluir este investimento?"
    );

    if (!confirmar) {
      return;
    }

    setDeletandoId(investimentoId);

    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await fetch(`/api/investimento/${investimentoId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao deletar investimento");
      }

      // Remove da lista sem recarregar página
      setInvestimentos((prev) =>
        prev.filter((inv) => inv.id !== investimentoId)
      );

      triggerUpdate();
    } catch (error) {
      console.error("Erro ao deletar investimento:", error);
      throw error instanceof Error ? error : new Error("Erro ao deletar investimento");
    } finally {
      setDeletandoId(null);
    }
  };

  const aportar = async (
    investimentoId: number,
    valorAporte: number
  ) => {
    setAporteEmProgresso(true);

    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (valorAporte <= 0) {
        throw new Error("Insira um valor válido e maior que zero para o aporte.");
      }

      const payload = {
        valorAporte: valorAporte,
      };

      const response = await fetch(`/api/investimento/${investimentoId}/aportar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Falha ao processar o aporte. Verifique o saldo da conta."
        );
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setAporteEmProgresso(false);
    }
  };

  const resgatar = async (
    investimentoId: number,
    valorResgatado: number,
    saldoRemanescente: number
  ) => {
    setResgateEmProgresso(true);

    try {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (valorResgatado <= 0) {
        throw new Error("O valor de resgate deve ser maior que zero.");
      }

      if (saldoRemanescente < 0) {
        throw new Error(
          "Informe o saldo remanescente válido. (Pode ser zero se resgatar tudo)."
        );
      }

      const payload = {
        valorResgatado: valorResgatado,
        saldoRemanescente: saldoRemanescente,
      };

      const response = await fetch(`/api/investimento/${investimentoId}/resgatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao processar o resgate.");
      }

      triggerUpdate();
      return true;
    } catch (err: any) {
      throw new Error(err.message || "Erro ao conectar com o servidor");
    } finally {
      setResgateEmProgresso(false);
    }
  };

  return {
    investimentos,
    carregando,
    erro,
    deletandoId,
    criandoInvestimento,
    atualizandoId,
    aporteEmProgresso,
    resgateEmProgresso,
    carregarInvestimentos,
    createInvestimento,
    updateInvestimento,
    deletarInvestimento,
    aportar,
    resgatar,
  };
}
