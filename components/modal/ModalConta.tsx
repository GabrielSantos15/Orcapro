"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";
import Input from "../forms/Input";
import Image from "next/image"; // Importante para renderizar as logos

// 1. Lista dos bancos pré-definidos que aparecerão como botões
const bancosPopulares = [
  { id: "nubank", nome: "Nubank", logo: "/bancos/nubank.png" },
  { id: "itau", nome: "Itaú", logo: "/bancos/itau.png" },
  { id: "bradesco", nome: "Bradesco", logo: "/bancos/bradesco.png" },
  { id: "santander", nome: "Santander", logo: "/bancos/santander.png" },
  { id: "inter", nome: "Inter", logo: "/bancos/inter.png" },
  { id: "bb", nome: "Banco do Brasil", logo: "/bancos/banco-do-brasil.png" },
  { id: "caixa", nome: "Caixa", logo: "/bancos/caixa.png" },
];

export default function ModalConta() {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);
  
  // 2. Estado para controlar se o usuário quer digitar um banco manualmente
  const [isOutro, setIsOutro] = useState(false);

  const [formData, setFormData] = useState({
    instituicao: "",
    tipo: "CORRENTE",
    saldo: "",
  });

  const tiposConta = ["CORRENTE", "POUPANCA", "INVESTIMENTO"];

  // Funções para lidar com o clique nos bancos
  const handleBankSelect = (nomeBanco: string) => {
    setIsOutro(false);
    setFormData({ ...formData, instituicao: nomeBanco });
  };

  const handleOutroSelect = () => {
    setIsOutro(true);
    setFormData({ ...formData, instituicao: "" }); // Limpa o campo para o usuário digitar
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validação extra: garantir que ele selecionou ou digitou um banco
    if (!formData.instituicao.trim()) {
      alert("Por favor, selecione ou digite a instituição bancária.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const contaData = {
        instituicao: formData.instituicao,
        tipo: formData.tipo,
        saldo: parseFloat(formData.saldo),
      };

      const response = await fetch("/api/conta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contaData),
      });

      if (response.ok) {
        alert("Conta criada com sucesso!");
        triggerUpdate(); // O seu gatilho que avisa o dashboard para atualizar!
        closeModal();
      } else {
        const error = await response.json();
        console.log(`Erro: ${error.error || "Falha ao criar conta"}`);
        alert(`Erro: ${error.error || "Falha ao criar conta"}`);
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Nova Conta</h2>
      <p className="text-sm text-gray-500 mb-4">
        Preencha os dados para cadastrar sua conta bancária.
      </p>
      <hr />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        {/* SELEÇÃO DE INSTITUIÇÃO VISUAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instituição Bancária
          </label>
          
          {/* Grid de Bancos */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {bancosPopulares.map((banco) => (
              <button
                key={banco.id}
                type="button"
                onClick={() => handleBankSelect(banco.nome)}
                className={`flex flex-col items-center justify-center p-2 border rounded-xl transition-all ${
                  formData.instituicao === banco.nome && !isOutro
                    ? "border-[var(--color-primary)] bg-[var(--secondary-background)] ring-1 ring-[var(--color-primary)]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="relative w-8 h-8 mb-1">
                  <Image 
                    src={banco.logo} 
                    alt={banco.nome} 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                  {banco.nome}
                </span>
              </button>
            ))}
            
            {/* Botão "Outro" */}
            <button
              type="button"
              onClick={handleOutroSelect}
              className={`flex flex-col items-center justify-center p-2 border rounded-xl transition-all ${
                isOutro
                  ? "border-[var(--color-primary)] bg-[var(--secondary-background)] ring-1 ring-[var(--color-primary)]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 mb-1 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-500 font-bold text-lg">+</span>
              </div>
              <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                Outro
              </span>
            </button>
          </div>

          {/* Campo de texto que só aparece se clicar em "Outro" */}
          {isOutro && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
              <Input
                type="text"
                id="instituicao-custom"
                name="instituicao"
                value={formData.instituicao}
                onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                placeholder="Digite o nome do banco"
                required={isOutro} // Só é obrigatório se o botão 'Outro' estiver ativo
              />
            </div>
          )}
        </div>

        {/* TIPO DE CONTA */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
            Tipo de Conta
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
          >
            {tiposConta.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* SALDO INICIAL */}
        <div>
          <label htmlFor="saldo" className="block text-sm font-medium text-gray-700">
            Saldo Inicial
          </label>
          <Input
            type="number"
            id="saldo"
            name="saldo"
            value={formData.saldo}
            onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min={0}
            required
          />
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 font-medium transition-colors mt-6"
        >
          {submitting ? "Criando..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
}