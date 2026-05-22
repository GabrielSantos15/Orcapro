
import { useState, useEffect } from "react";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore"; 

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Subscrever apenas ao gatilho de atualização 
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
  }, [atualizarGatilho]); // roda novamente quando o gatilho mudar
  return { contas, loading, error };
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