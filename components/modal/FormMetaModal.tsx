"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea"; // Usando o componente Textarea que criamos
import { Meta } from "@/interfaces/Meta";

interface FormMetaModalProps {
  meta?: Meta | null;
}

export default function FormMetaModal({ meta }: FormMetaModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!meta;

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valorAlvo: "",
    valorAtual: "0", // Incluído para permitir ajustes manuais
    dataLimite: "",
  });

  useEffect(() => {
    if (meta) {
      setFormData({
        nome: meta.nome || "",
        descricao: meta.descricao || "",
        valorAlvo: String(meta.valorAlvo) || "",
        valorAtual: String(meta.valorAtual || "0"),
        dataLimite: meta.dataLimite ? meta.dataLimite.split("T")[0] : "",
      });
    }
  }, [meta]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("Sessão expirada.");

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        valorAlvo: parseFloat(formData.valorAlvo),
        valorAtual: parseFloat(formData.valorAtual),
        dataLimite: formData.dataLimite || null,
      };

      const url = isEditMode ? `/api/meta/${meta?.id}` : "/api/meta";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao salvar meta.");

      alert(
        isEditMode
          ? "Meta atualizada com sucesso!"
          : "Meta criada com sucesso!",
      );
      triggerUpdate();
      closeModal();
    } catch (error: any) {
      alert(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        {isEditMode ? "Editar Meta" : "Nova Meta"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {isEditMode
          ? "Ajuste os detalhes e prazos do seu objetivo financeiro."
          : "Defina um novo objetivo para começar a guardar dinheiro."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome do Objetivo"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: Viagem para a Europa, Carro Novo..."
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
            label="Valor Alvo (R$)"
            type="number"
            value={formData.valorAlvo}
            onChange={(e) =>
              setFormData({ ...formData, valorAlvo: e.target.value })
            }
            placeholder="0.00"
            step="0.01"
            min={1}
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
            label="Progresso Atual (R$)"
            type="number"
            value={formData.valorAtual}
            onChange={(e) =>
              setFormData({ ...formData, valorAtual: e.target.value })
            }
            placeholder="0.00"
            step="0.01"
            min={0}
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {submitting
            ? "Salvando..."
            : isEditMode
              ? "Salvar Alterações"
              : "Criar Meta"}
        </button>
      </form>
    </div>
  );
}
