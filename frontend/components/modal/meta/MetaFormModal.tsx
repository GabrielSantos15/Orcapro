"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../../forms/Input";
import Textarea from "../../forms/Textarea";
import { Meta } from "@/interfaces/Meta";
import { Target } from "lucide-react";
import { toast } from "sonner";

interface FormMetaModalProps {
  meta?: Meta | null;
}

export default function MetaFormModal({ meta }: FormMetaModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!meta;

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valorAlvo: "",
    valorAtual: "",
    dataLimite: "",
  });

  useEffect(() => {
    if (meta) {
      setFormData({
        nome: meta.nome || "",
        descricao: meta.descricao || "",
        valorAlvo: meta.valorAlvo ? meta.valorAlvo.toFixed(2) : "",
        valorAtual: meta.valorAtual ? meta.valorAtual.toFixed(2) : "0.00",
        dataLimite: meta.dataLimite ? meta.dataLimite.split("T")[0] : "",
      });
    }
  }, [meta]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Limpeza da máscara de moeda (ex: "1.500,00" -> 1500.00)
      const getValorNumerico = (valorStr: string) => {
        if (!valorStr) return 0;
        const valorSemPonto = valorStr.replace(/\./g, "");
        const valorComPontoDec = valorSemPonto.replace(",", ".");
        return parseFloat(valorComPontoDec) || 0;
      };

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        valorAlvo: getValorNumerico(formData.valorAlvo),
        valorAtual: getValorNumerico(formData.valorAtual),
        dataLimite: formData.dataLimite || null,
      };

      const url = isEditMode ? `/api/meta/${meta?.id}` : "/api/meta";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao salvar meta.");

      toast.success(
        isEditMode
          ? "Meta atualizada com sucesso!"
          : "Meta criada com sucesso!",
      );
      triggerUpdate();
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-light)] border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <Target className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Meta" : "Nova Meta"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode
              ? "Ajuste os detalhes e prazos do seu objetivo financeiro."
              : "Defina um novo objetivo para começar a guardar dinheiro."}
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome do Objetivo"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: Viagem para a Europa, Reserva de Emergência..."
          required
          autoFocus
        />

        <Textarea
          label="Descrição (Opcional)"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          placeholder="Detalhes sobre esse objetivo..."
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor Alvo"
            type="number"
            isCurrency={true}
            value={formData.valorAlvo}
            onChange={(e) =>
              setFormData({ ...formData, valorAlvo: e.target.value })
            }
            placeholder="0.00"
            step="0.01"
            required
          />

          <Input
            label="Data Limite (Prazo)"
            type="date"
            value={formData.dataLimite}
            onChange={(e) =>
              setFormData({ ...formData, dataLimite: e.target.value })
            }
          />
        </div>

        {isEditMode && (
          <Input
            label="Progresso Atual (Registro Manual)"
            type="number"
            isCurrency={true}
            value={formData.valorAtual}
            onChange={(e) =>
              setFormData({ ...formData, valorAtual: e.target.value })
            }
            placeholder="0.00"
            step="0.01"
          />
        )}

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
            disabled={submitting}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Salvando..."
              : isEditMode
                ? "Salvar Alterações"
                : "Criar Meta"}
          </button>
        </div>
      </form>
    </div>
  );
}