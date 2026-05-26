"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";
import Input from "../forms/Input";
import { useCategorias } from "@/hooks/useCategorias";

export default function CreateCategoriaModal() {
  const { closeModal } = useModalStore();
  const { criarCategoria } = useCategorias();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "ENTRADA",
    ativa: true,
  });

  const tiposCategoria = ["ENTRADA", "SAIDA"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, digite um nome para a categoria.");
      return;
    }

    setSubmitting(true);

    try {
      await criarCategoria(formData.nome, formData.tipo as "ENTRADA" | "SAIDA");
      alert("Categoria criada com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
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
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="tipo"
            className="block text-sm font-medium text-gray-700"
          >
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

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting ? "Criando..." : "Criar Categoria"}
        </button>
      </form>
    </div>
  );
}
