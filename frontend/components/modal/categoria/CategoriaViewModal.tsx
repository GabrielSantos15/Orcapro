"use client";

import { useState, useEffect } from "react";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "@/interfaces/Categoria";
import { useModalStore } from "@/store/useModalStore";
import { Tags } from "lucide-react";
import { toast } from "sonner";

interface CategoriaViewModalProps {
  categoria?: Partial<Categoria> | Categoria;
  id?: number;
}

const TIPOS_CATEGORIA: Record<string, { label: string; cor: string }> = {
  entrada: { label: "Entrada", cor: "bg-[var(--success-color)]/10 text-[var(--success-color)] border-[var(--success-color)]/20" },
  saida: { label: "Saída", cor: "bg-[var(--danger-color)]/10 text-[var(--danger-color)] border-[var(--danger-color)]/20" },
};

export default function CategoriaViewModal({ categoria: categoriaInicial, id }: CategoriaViewModalProps) {
  const [categoria, setCategoria] = useState<Categoria | null>(
    categoriaInicial && "nome" in categoriaInicial ? (categoriaInicial as Categoria) : null
  );
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acaoEmProgresso, setAcaoEmProgresso] = useState(false); 
  
  const { closeModal, openModal } = useModalStore();
  const { deletarCategoria, reativarCategoria, categorias } = useCategorias(); 

  useEffect(() => {
    const isCategoriaCompleta = categoriaInicial && "nome" in categoriaInicial && "tipo" in categoriaInicial;

    if (isCategoriaCompleta) {
      setCategoria(categoriaInicial as Categoria);
      return;
    }

    const categoriaId = categoriaInicial?.id || id;
    if (!categoriaId) {
      setError("ID da categoria não fornecido.");
      return;
    }

    const found = categorias.find(c => c.id === Number(categoriaId));
    if (found) {
        setCategoria(found);
    } else {
        setError("Detalhes da categoria não encontrados.");
    }
    
  }, [categoriaInicial, id, categorias]);

  const getTipoCategoria = (tipo?: string) => {
    const tipoNorm = tipo?.toLowerCase() || "";
    return TIPOS_CATEGORIA[tipoNorm] || {
      label: tipo || "Não definido",
      cor: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]",
    };
  };

  const handleDelete = async () => {
    if (!categoria) return;
    setError(null);
    setAcaoEmProgresso(true);
    try {
      await deletarCategoria(categoria.id);
      toast.success("Categoria excluída (inativada) com sucesso!");
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir categoria";
      setError(message);
    } finally {
      setAcaoEmProgresso(false);
    }
  };

  const handleReactivate = async () => {
    if (!categoria) return;
    setError(null);
    setAcaoEmProgresso(true);
    try {
      await reativarCategoria(categoria.id);
      toast.success("Categoria reativada com sucesso!");
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao reativar categoria";
      setError(message);
    } finally {
      setAcaoEmProgresso(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent"></div>
        <p className="text-sm font-medium text-[var(--text-muted)]">Buscando detalhes da categoria...</p>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="space-y-6">
        <p className="text-center font-medium text-[var(--danger-color)]">
          {error || "Categoria não encontrada"}
        </p>
      </div>
    );
  }

  const tipoBadge = getTipoCategoria(categoria.tipo);

  return (
    <div className="space-y-6">
      
      {/* HEADER DA CATEGORIA */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="relative flex h-16 w-16 items-center justify-center flex-shrink-0 rounded-xl bg-[var(--primary-light)] border border-[var(--border-color)] shadow-sm">
           <Tags className="text-[var(--primary-color)] w-8 h-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">{categoria.nome}</h2>
          <span className={`mt-1 inline-block rounded-lg px-2.5 py-1 text-xs font-semibold border ${tipoBadge.cor}`}>
            {tipoBadge.label}
          </span>
        </div>
      </div>

      {/* INFORMAÇÕES EXTRAS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1">Status</p>
          <div className="flex items-center gap-2">
             <span className={`h-2.5 w-2.5 rounded-full ${categoria.ativa ? 'bg-[var(--success-color)]' : 'bg-[var(--danger-color)]'}`}></span>
             <p className="text-sm font-semibold text-[var(--text-primary)]">{categoria.ativa ? 'Ativa' : 'Desativada'}</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1">Fluxo</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
             {categoria.tipo === "ENTRADA" ? "Receitas" : "Despesas"}
          </p>
        </div>
      </div>

      {/* MENSAGEM DE ERRO */}
      {error && (
        <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm border border-[var(--danger-color)]/20 font-medium">
          {error}
        </div>
      )}

      {/* BOTÕES DE AÇÃO */}
      <div className="flex gap-3 pt-2">
        {categoria.ativa ? (
          <button
            onClick={handleDelete}
            disabled={acaoEmProgresso}
            className="flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--danger-color)]/10 hover:text-[var(--danger-color)] hover:border-[var(--danger-color)]/30 font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {acaoEmProgresso ? "Processando..." : "Excluir"}
          </button>
        ) : (
          <button
            onClick={handleReactivate}
            disabled={acaoEmProgresso}
            className="flex-1 px-4 py-3 bg-[var(--success-color)] text-white rounded-[var(--radius-md)] hover:brightness-110 font-semibold transition disabled:opacity-50 shadow-md hover:shadow-lg cursor-pointer"
          >
            {acaoEmProgresso ? "Processando..." : "↻ Reativar"}
          </button>
        )}

        {categoria.ativa && (
          <button
            onClick={() => {
              closeModal(); 
              setTimeout(() => openModal("updateCategoria", categoria), 100); 
            }}
            disabled={acaoEmProgresso}
            className="flex-1 px-4 py-3 bg-[var(--primary-color)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-semibold transition disabled:opacity-50 shadow-md hover:shadow-lg cursor-pointer"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}