"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../forms/Input";
import { Meta } from "@/interfaces/Meta"; // Certifique-se de ter essa interface criada!

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
    dataLimite: "",
  });

  useEffect(() => {
    if (meta) {
      setFormData({
        nome: meta.nome || "",
        descricao: meta.descricao || "",
        valorAlvo: String(meta.valorAlvo) || "",
        dataLimite: meta.dataLimite ? meta.dataLimite.split("T")[0] : "", 
      });
    }
  }, [meta]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, preencha o nome da meta.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      // Monta o payload dependendo de ser Criação ou Edição
      const metaData = isEditMode
        ? {
            nome: formData.nome,
            descricao: formData.descricao,
            valorAlvo: parseFloat(formData.valorAlvo),
            valorAtual: parseFloat(formData.valorAtual), // Permite corrigir saldo na edição
            dataLimite: formData.dataLimite || null,
          }
        : {
            nome: formData.nome,
            descricao: formData.descricao,
            valorAlvo: parseFloat(formData.valorAlvo),
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
        body: JSON.stringify(metaData),
      });

      if (response.ok) {
        alert(isEditMode ? "Meta atualizada com sucesso!" : "Meta criada com sucesso!");
        triggerUpdate(); // Recarrega a listagem
        closeModal();
      } else {
        const error = await response.json();
        console.log(`Erro: ${error.error || "Falha ao " + (isEditMode ? "atualizar" : "criar") + " a meta"}`);
        alert(`Erro: ${error.error || "Falha ao " + (isEditMode ? "atualizar" : "criar") + " a meta"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar meta:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        {isEditMode ? "Editar Meta" : "Nova Meta"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {isEditMode
          ? "Ajuste os detalhes e prazos do seu objetivo financeiro."
          : "Defina um novo objetivo para começar a guardar dinheiro."}
      </p>
      <hr />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        {/* NOME DA META */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Objetivo
          </label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Viagem para a Europa, Carro Novo..."
            required
            autoFocus
          />
        </div>

        {/* DESCRIÇÃO (Opcional) */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição (Opcional)
          </label>
          <Input
            type="text"
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Detalhes sobre esse objetivo..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* VALOR ALVO (Objetivo) */}
          <div>
            <label htmlFor="valorAlvo" className="block text-sm font-medium text-gray-700 mb-1">
              Valor Alvo (R$)
            </label>
            <Input
              type="number"
              id="valorAlvo"
              name="valorAlvo"
              value={formData.valorAlvo}
              onChange={(e) => setFormData({ ...formData, valorAlvo: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min={1}
              required
            />
          </div>

          {/* DATA LIMITE (Prazo) */}
          <div>
            <label htmlFor="dataLimite" className="block text-sm font-medium text-gray-700 mb-1">
              Prazo (Opcional)
            </label>
            <Input
              type="date"
              id="dataLimite"
              name="dataLimite"
              value={formData.dataLimite}
              onChange={(e) => setFormData({ ...formData, dataLimite: e.target.value })}
            />
          </div>
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting 
            ? (isEditMode ? "Atualizando..." : "Salvando...") 
            : (isEditMode ? "Salvar Alterações" : "Criar Meta")}
        </button>
      </form>
    </div>
  );
}