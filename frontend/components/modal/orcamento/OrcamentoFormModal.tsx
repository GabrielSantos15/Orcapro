"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import { PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useCategorias } from "@/hooks/useCategorias";
import { useOrcamentos } from "@/hooks/useOrcamento";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { Orcamento } from "@/interfaces/Orcamento";

interface OrcamentoFormModalProps {
  orcamento?: Orcamento | null;
}

export default function OrcamentoFormModal({ orcamento }: OrcamentoFormModalProps) {
  const { closeModal } = useModalStore();
  const { categorias, carregando: carregandoCategorias } = useCategorias();

  const { orcamentos, criarOrcamento, updateOrcamento, fetchOrcamentos } = useOrcamentos();

  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [tipo, setTipo] = useState<"SAIDA" | "ENTRADA">(
    orcamento?.categoria?.tipo || "SAIDA"
  );

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

      // Descobre o tipo da categoria sendo editada 
      if (categorias.length > 0) {
        const categoriaEditada = categorias.find(c => c.id === orcamento.categoria?.id);
        if (categoriaEditada) {
          setTipo(categoriaEditada.tipo);
        }
      }
    }
  }, [orcamento, categorias]);

  // Limpa a categoria selecionada sempre que o usuário trocar de aba
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({ ...prev, categoriaId: "" }));
    }
  }, [tipo, isEditMode]);

  useEffect(() => {
    fetchOrcamentos()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

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
      setErro(`A ${tipo === "SAIDA" ? "limite" : "meta"} deve ser maior que zero.`);
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await updateOrcamento(orcamento.id, {
          categoriaId: parseInt(formData.categoriaId),
          limite: limiteNumerico,
        });
        toast.success(`${tipo === "SAIDA" ? "Orçamento" : "Objetivo"} atualizado com sucesso!`);
      } else {
        await criarOrcamento({
          categoriaId: parseInt(formData.categoriaId),
          limite: limiteNumerico,
        });
        toast.success(`${tipo === "SAIDA" ? "Orçamento" : "Objetivo"} criado com sucesso!`);
      }
      closeModal();
    } catch (error: any) {
      setErro(error.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoriasJaUsadas = orcamentos?.map(o =>
    String(o.categoria?.id || o.categoria.id)
  ) || [];

  // 2. Filtra convertendo o ID do "cat" para String também
  const categoriasFiltradas = categorias.filter(cat =>
    cat.tipo === tipo && !categoriasJaUsadas.includes(String(cat.id))
  );

  // --- COLE ISSO AQUI PARA DEPURAR ---
  console.log("=== DEBUG DO MODAL ===");
  console.log("1. Variável orcamentos:", orcamentos);
  console.log("2. IDs mapeados (categoriasJaUsadas):", categoriasJaUsadas);
  console.log("3. Primeira categoria da lista:", categorias[0]);
  // ------------------------------------

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 border rounded-[var(--radius-md)] ${tipo === "SAIDA"
          ? "bg-[var(--primary-light)] border-[var(--border-color)] text-[var(--primary-color)]"
          : "bg-green-500/10 border-green-500/20 text-green-500"
          }`}
        >
          <PieChart className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode
              ? (tipo === "SAIDA" ? "Editar Limite" : "Editar Meta")
              : (tipo === "SAIDA" ? "Novo Limite de Gasto" : "Nova Meta de Ganho")}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode
              ? "Ajuste o valor para esta categoria."
              : `Defina ${tipo === "SAIDA" ? "um limite de gastos para controlar" : "uma meta para seus ganhos com"} essa categoria.`}
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

        {/* TABS DE SELEÇÃO (Meta vs Limite) - Oculto/Desabilitado em Edit Mode */}
        {!isEditMode && (
          <div className="flex bg-[var(--bg-secondary)] p-1 rounded-[var(--radius-md)]">
            <button
              type="button"
              onClick={() => setTipo("SAIDA")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${tipo === "SAIDA"
                ? "bg-[var(--bg-surface)] text-[var(--primary-color)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
            >
              <TrendingDown className="w-4 h-4" /> Limite (Saídas)
            </button>
            <button
              type="button"
              onClick={() => setTipo("ENTRADA")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${tipo === "ENTRADA"
                ? "bg-[var(--bg-surface)] text-green-500 shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
            >
              <TrendingUp className="w-4 h-4" /> Meta (Entradas)
            </button>
          </div>
        )}

        {/* SELECT DE CATEGORIA */}
        {isEditMode ? (
          <Input
            label="Categoria"
            name="categoriaNome"
            type="text"
            value={orcamento?.categoria.nome || ""}
            disabled
            readOnly
            className="opacity-70 cursor-not-allowed"
          />
        ) : (
          <Select
            label="Categoria"
            name="categoriaId"
            value={formData.categoriaId}
            onChange={(e) => {
              setFormData({ ...formData, categoriaId: e.target.value });
              if (erro) setErro(null);
            }}
            disabled={carregandoCategorias || categoriasFiltradas.length === 0}
            required
          >
            <option value="" disabled>
              {carregandoCategorias
                ? "Carregando categorias..."
                : categoriasFiltradas.length === 0
                  ? `Todas as categorias já possuem ${tipo === "SAIDA" ? "limite" : "meta"}`
                  : "Selecione a categoria"}
            </option>
            {categoriasFiltradas.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </Select>
        )}

        {/* INPUT DE LIMITE / META */}
        <Input
          label={tipo === "SAIDA" ? "Limite de Gastos (R$)" : "Meta de Ganhos (R$)"}
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
            disabled={submitting || (!isEditMode && !formData.categoriaId) || !formData.limite}
            className={`cursor-pointer flex-1 text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${tipo === "SAIDA"
              ? "bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {submitting
              ? "Salvando..."
              : isEditMode
                ? "Salvar Alterações"
                : (tipo === "SAIDA" ? "Criar Limite" : "Criar Meta")}
          </button>
        </div>
      </form>
    </div>
  );
}