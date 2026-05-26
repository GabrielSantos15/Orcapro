"use client";

import { useState, useEffect, useCallback } from "react";
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

  const carregarInvestimentos = useCallback(async () => {
    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch("/api/investimento", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao buscar investimentos.");

      const data = await res.json();

      const investimentosOrdenados = [...data].sort(
        (a, b) =>
          new Date(b.dataAplicacao).getTime() -
          new Date(a.dataAplicacao).getTime(),
      );

      setInvestimentos(investimentosOrdenados);
      setErro(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarInvestimentos();
  }, [atualizarGatilho, carregarInvestimentos]);

  const createInvestimento = async (payload: any) => {
    setCriandoInvestimento(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/investimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conta: payload.conta,
          ativo: payload.ativo,
          tipo: payload.tipo,
          valorInvestido: payload.valorInvestido,
          percentual: payload.percentual,
          indicador: payload.indicador,
          dataAplicacao: payload.dataAplicacao,
          ativoStatus: true,
        }),
      });

      if (!response.ok) throw new Error("Falha ao criar investimento");

      triggerUpdate();
      return true;
    } finally {
      setCriandoInvestimento(false);
    }
  };

  const updateInvestimento = async (id: number, payload: any) => {
    setAtualizandoId(id);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/investimento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conta: payload.conta,
          ativo: payload.ativo,
          tipo: payload.tipo,
          valorInvestido: payload.valorInvestido,
          percentual: payload.percentual,
          indicador: payload.indicador,
          dataAplicacao: payload.dataAplicacao,
          ativoStatus: payload.ativoStatus, 
        }),
      });

      if (!response.ok) throw new Error("Falha ao atualizar investimento");

      triggerUpdate();
      return true;
    } finally {
      setAtualizandoId(null);
    }
  };

  const deletarInvestimento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este investimento?")) return;
    setDeletandoId(id);
    try {
      const token = localStorage.getItem("user_token");
      await fetch(`/api/investimento/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestimentos((prev) => prev.filter((inv) => inv.id !== id));
      triggerUpdate();
    } finally {
      setDeletandoId(null);
    }
  };

  const aportar = async (id: number, valor: number) => {
    setAporteEmProgresso(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`/api/investimento/${id}/aportar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ valorAporte: valor }),
      });
      if (!res.ok) throw new Error("Falha ao processar aporte.");
      triggerUpdate();
    } finally {
      setAporteEmProgresso(false);
    }
  };

  const resgatar = async (
    id: number,
    valorResgatado: number,
    saldoRemanescente: number,
  ) => {
    setResgateEmProgresso(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`/api/investimento/${id}/resgatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ valorResgatado, saldoRemanescente }),
      });
      if (!res.ok) throw new Error("Falha ao processar resgate.");
      triggerUpdate();
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
