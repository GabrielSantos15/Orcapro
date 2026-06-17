"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import { useCategorias } from "@/hooks/useCategorias";
import { Tags } from "lucide-react";
import { toast } from "sonner";
import { Categoria } from "@/interfaces/Categoria";
import Input from "../../forms/Input";

interface CategoriaFormModalProps {
  categoria?: Categoria | null;
}

export default function CategoriaFormModal({ categoria }: CategoriaFormModalProps) {
  const { closeModal } = useModalStore();
  const { criarCategoria, updateCategoria } = useCategorias();

  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const isEditMode = !!categoria;

  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    tipo: "ENTRADA",
    ativa: true,
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        id: categoria.id || 0,
        nome: categoria.nome || "",
        tipo: categoria.tipo || "ENTRADA",
        ativa: categoria.ativa ?? true,
      });
    }
  }, [categoria]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    if (!formData.nome.trim()) {
      setErro("Por favor, digite um nome para a categoria.");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await updateCategoria(formData.id, formData.nome, formData.tipo as "ENTRADA" | "SAIDA");
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await criarCategoria(formData.nome, formData.tipo as "ENTRADA" | "SAIDA");
        toast.success("Categoria criada com sucesso!");
      }
      closeModal();
    } catch (error: any) {
      console.error("Erro ao salvar categoria:", error);
      setErro(error.message || "Erro ao salvar categoria. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <Tags className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode
              ? "O tipo da categoria não pode ser alterado após a criação."
              : "Crie uma nova categoria para organizar suas transações."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] border border-[var(--danger-color)]/20 rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        {/* TOGGLE TIPO DE CATEGORIA (Estilo Pílula) */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex justify-between items-end">
            <span>Tipo de Categoria</span>
            {isEditMode && <span className="text-[10px] text-[var(--danger-color)] uppercase tracking-wider font-bold">Bloqueado</span>}
          </label>
          <div className={`flex p-1 gap-1 border rounded-xl ${isEditMode ? 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)]/50' : 'bg-[var(--bg-input)] border-[var(--border-color)]'}`}>
            <button
              type="button"
              disabled={isEditMode}
              onClick={() => {
                setFormData({ ...formData, tipo: "ENTRADA" });
                if (erro) setErro(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${
                formData.tipo === "ENTRADA"
                  ? "bg-[var(--success-color)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/40 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)]"
              } ${!isEditMode ? "cursor-pointer" : ""}`}
            >
              Entrada (Receita)
            </button>
            <button
              type="button"
              disabled={isEditMode}
              onClick={() => {
                setFormData({ ...formData, tipo: "SAIDA" });
                if (erro) setErro(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${
                formData.tipo === "SAIDA"
                  ? "bg-[var(--danger-color)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/40 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)]"
              } ${!isEditMode ? "cursor-pointer" : ""}`}
            >
              Saída (Despesa)
            </button>
          </div>
        </div>

        {/* NOME DA CATEGORIA */}
        <Input
          label="Nome da Categoria"
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={(e) => {
            setFormData({ ...formData, nome: e.target.value });
            if (erro) setErro(null);
          }}
          placeholder="Ex: Alimentação, Transporte, Saúde"
          required
          autoFocus
        />

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={submitting}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting || !formData.nome.trim()}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Salvando..."
              : isEditMode
                ? "Salvar Alterações"
                : "Criar Categoria"}
          </button>
        </div>
      </form>
    </div>
  );
}