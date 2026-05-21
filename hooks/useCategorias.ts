import { useState, useEffect } from "react";
import { Categoria } from "@/interfaces/Categoria";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
}