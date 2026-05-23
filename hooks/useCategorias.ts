import { useState, useEffect } from "react";
import { Categoria } from "@/interfaces/Categoria";
import { useModalStore } from "@/store/useModalStore";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true); 
  const [erro, setErro] = useState<string | null>(null);
  const { atualizarGatilho } = useModalStore();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("user_token");
        
        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        const res = await fetch("/api/categoria", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Falha ao buscar as categorias do banco de dados.");
        }

        const data = await res.json();
        setCategorias(data);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchCategorias();
  }, [atualizarGatilho]);

  return { categorias, carregando, erro };
}