import { useState, useEffect } from "react";
import { Categoria } from "@/interfaces/Categoria";
import { useModalStore } from "@/store/useModalStore";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { atualizarGatilho, triggerUpdate } = useModalStore();


  const fetchCategorias = async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/categoria");

      if (!res.ok) throw new Error("Falha ao buscar categorias");

      const data = await res.json();
      setCategorias(data);
      setErro(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const criarCategoria = async (nome: string, tipo: "ENTRADA" | "SAIDA") => {
    try {
      const res = await fetch("/api/categoria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, tipo }),
      });

      if (!res.ok) throw new Error("Falha ao criar categoria");

      const novaCategoria = await res.json();
      setCategorias([...categorias, novaCategoria]);
      triggerUpdate();
      return novaCategoria;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  const atualizarCategoria = async (
    id: number,
    nome: string,
    tipo: "ENTRADA" | "SAIDA"
  ) => {
    try {
      const res = await fetch(`/api/categoria/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, tipo }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar categoria");

      const categoriaAtualizada = await res.json();
      setCategorias(
        categorias.map((cat) => (cat.id === id ? categoriaAtualizada : cat))
      );
      triggerUpdate();
      return categoriaAtualizada;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  const deletarCategoria = async (id: number) => {
    try {
      const res = await fetch(`/api/categoria/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Falha ao deletar categoria");

      setCategorias(categorias.filter((cat) => cat.id !== id));
      triggerUpdate();
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  const reativarCategoria = async (id: number) => {
    try {
      const res = await fetch(`/api/categoria/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativa: 1 }),
      });

      if (!res.ok) throw new Error("Falha ao reativar categoria");

      const categoriaAtualizada = await res.json();
      setCategorias(
        categorias.map((cat) => (cat.id === id ? categoriaAtualizada : cat))
      );
      triggerUpdate();
      return categoriaAtualizada;
    } catch (err: any) {
      setErro(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [atualizarGatilho]);

  return {
    categorias,
    carregando,
    erro,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
    reativarCategoria,
    recarregar: fetchCategorias,
  };
}