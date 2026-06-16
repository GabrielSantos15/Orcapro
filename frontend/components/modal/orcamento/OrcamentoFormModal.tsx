"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../../forms/Input";
import Select from "../../forms/Select";
import { PieChart } from "lucide-react";
import { toast } from "sonner";
import { useCategorias } from "@/hooks/useCategorias";
import { useOrcamentos } from "@/hooks/useOrcamento";

interface Orcamento {
  id: number;
  categoria: { id: number; nome: string };
  limite: number;
}

interface OrcamentoFormModalProps {
  orcamento?: Orcamento | null;
}

export default function OrcamentoFormModal({ orcamento }: OrcamentoFormModalProps) {
  const { closeModal } = useModalStore();
  const { categorias, carregando: carregandoCategorias } = useCategorias();
  
  const { criarOrcamento, updateOrcamento } = useOrcamentos();
  
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const isEditMode = !!orcamento;

  const [formData, setFormData] = useState({
    categoriaId: "",
    limite: "",
  });

  useEffect(() => {
    if (orcamento) {
      setFormData({
        categoriaId: String(orcamento.categoria?.id || ""),
        limite: orcamento.limite ? orcamento.limite.toFixed(2) : "",
      });
    }
  }, [orcamento]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    // Limpeza da máscara de moeda (ex: "1.500,00" -> 1500.00)
    const getValorNumerico = (valorStr: string) => {
      if (!valorStr) return 0;
      const valorSemPonto = valorStr.replace(/\./g, "");
      const valorComPontoDec = valorSemPonto.replace(",", ".");
      return parseFloat(valorComPontoDec) || 0;
    };

    const limiteNumerico = getValorNumerico(formData.limite);

    if (!formData.categoriaId) {
      setErro("Selecione uma categoria para o orçamento.");
      return;
    }

    if (limiteNumerico <= 0) {
      setErro("O limite do orçamento deve ser maior que zero.");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await updateOrcamento(orcamento.id, {
          categoriaId: parseInt(formData.categoriaId),
          limite: limiteNumerico,
        });
        toast.success("Orçamento atualizado com sucesso!");
      } else {
        await criarOrcamento({
          categoriaId: parseInt(formData.categoriaId),
          limite: limiteNumerico,
        });
        toast.success("Orçamento criado com sucesso!");
      }
      closeModal();
    } catch (error: any) {
      setErro(error.message || "Erro ao salvar o orçamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoriasDisponiveis = categorias;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <PieChart className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Orçamento" : "Novo Orçamento"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode 
              ? "Ajuste o limite de gastos para esta categoria." 
              : "Defina um limite de gastos para controlar seu dinheiro."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* MENSAGEM DE ERRO (Dentro do form, no topo) */}
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] border border-[var(--danger-color)]/20 rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        {/* SELECT DE CATEGORIA */}
        <Select
          label="Categoria"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={(e) => {
            setFormData({ ...formData, categoriaId: e.target.value });
            if (erro) setErro(null);
          }}
          disabled={carregandoCategorias || isEditMode} // Em edição, geralmente não se muda a categoria
          required
        >
          <option value="" disabled>
            {carregandoCategorias ? "Carregando categorias..." : "Selecione a categoria"}
          </option>
          {categoriasDisponiveis.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </Select>

        {/* INPUT DE LIMITE */}
        <Input
          label="Limite de Gastos (R$)"
          type="number"
          isCurrency={true}
          name="limite"
          value={formData.limite}
          onChange={(e) => {
             setFormData({ ...formData, limite: e.target.value });
             if (erro) setErro(null);
          }}
          placeholder="0.00"
          required
          autoFocus={!isEditMode}
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
            disabled={submitting || !formData.categoriaId || !formData.limite}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting 
              ? "Salvando..." 
              : isEditMode 
                ? "Salvar Alterações" 
                : "Criar Orçamento"}
          </button>
        </div>
      </form>
    </div>
  );
}