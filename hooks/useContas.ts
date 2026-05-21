
import { useState, useEffect } from "react";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore"; // Importar a store

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Subscrever apenas ao gatilho de atualização global
  const { atualizarGatilho } = useModalStore();

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await fetch("/api/conta", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Falha ao buscar as Contas.");

        const data = await res.json();
        setContas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContas();
  }, [atualizarGatilho]); // <--roda novamente quando o gatilho mudar

  return { contas, loading, error };
}