
import { useState, useEffect } from "react";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore";

const getToken = () => {
  const token = localStorage.getItem("user_token");
  if (!token) throw new Error("Usuário não autenticado");
  return token;
};

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const { atualizarGatilho, triggerUpdate } = useModalStore();

  const carregarContas = async () => {
    try {
      setCarregando(true);
      const token = getToken();
      const res = await fetch("/api/conta", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao buscar as Contas.");

      const data = await res.json();
      setContas(data);
      setErro(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const deletarConta = async (contaId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta conta?")) return;

    setDeletandoId(contaId);
    try {
      const token = getToken();
      const response = await fetch(`/api/conta/${contaId}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao deletar conta");
      }

      setContas((prev) => prev.filter((c) => c.id !== contaId));
      triggerUpdate();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      throw error instanceof Error ? error : new Error("Erro ao deletar conta");
    } finally {
      setDeletandoId(null);
    }
  };

  const reativarConta = async (conta: Conta) => {
    setAtualizandoId(conta.id);
    try {
      const token = getToken();
      const response = await fetch(`/api/conta/${conta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...conta, ativa: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao reativar conta");
      }

      triggerUpdate();
      return true;
    } catch (error) {
      console.error("Erro ao reativar conta:", error);
      throw error instanceof Error ? error : new Error("Erro ao reativar conta");
    } finally {
      setAtualizandoId(null);
    }
  };

  const buscarContaPorId = async (contaId: number): Promise<Conta> => {
    try {
      const token = getToken();
      const res = await fetch(`/api/conta/${contaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao buscar a conta");
      return await res.json();
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    carregarContas();
  }, [atualizarGatilho]);

  return {
    contas,
    carregando,
    erro,
    deletarConta,
    reativarConta,
    buscarContaPorId,
    deletandoId,
    atualizandoId,
  };
}

export const listaBancosPopulares = [
  { id: "nubank", nome: "Nubank", logo: "/bancos/nubank.jpg" },
  { id: "itau", nome: "Itaú", logo: "/bancos/itau.png" },
  { id: "bradesco", nome: "Bradesco", logo: "/bancos/bradesco.png" },
  { id: "santander", nome: "Santander", logo: "/bancos/santander.jpg" },
  { id: "inter", nome: "Inter", logo: "/bancos/inter.png" },
  { id: "bb", nome: "Banco do Brasil", logo: "/bancos/banco-do-brasil.jpg" },
  { id: "caixa", nome: "Caixa", logo: "/bancos/caixa.png" },
  { id: "carteira", nome: "Carteira", logo: "/bancos/carteira.jpg" },
];