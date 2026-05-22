"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";
import Input from "../forms/Input";

export default function ModalCategoria() {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "RECEITA",
    ativa: true,
  });

  const tiposCategoria = ["RECEITA", "DESPESA"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert("Por favor, digite um nome para a categoria.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const categoriaData = {
        nome: formData.nome,
        tipo: formData.tipo,
        ativa: formData.ativa,
      };

      const response = await fetch("/api/categoria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoriaData),
      });

      if (response.ok) {
        alert("Categoria criada com sucesso!");
        triggerUpdate();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao criar categoria"}`);
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Nova Categoria</h2>
      <p className="text-sm text-gray-500 mb-4">
        Preencha os dados para criar uma nova categoria.
      </p>
      <hr />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        {/* NOME DA CATEGORIA */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome da Categoria
          </label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Alimentação, Transporte, Saúde"
            required
          />
        </div>

        {/* TIPO DE CATEGORIA */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          >
            {tiposCategoria.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* ATIVA */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ativa"
            name="ativa"
            checked={formData.ativa}
            onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="ativa" className="ml-2 text-sm font-medium text-gray-700">
            Categoria Ativa
          </label>
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting ? "Criando..." : "Criar Categoria"}
        </button>
      </form>
    </div>
  );
}