"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Input from "../forms/Input";
import { Investimento } from "@/interfaces/Investimento";

interface FormAporteInvestimentoProps {
  investimento: Investimento;
}

export default function FormAporteInvestimento({
  investimento
}: FormAporteInvestimentoProps) {
  const { closeModal } = useModalStore();
  const { aportar, aporteEmProgresso } = useInvestimentos();
  
  const [formData, setFormData] = useState({
    valorAporte: "",
  });

  const [erro, setErro] = useState<string | null>(null);

  const valorDigitado = parseFloat(formData.valorAporte) || 0;
  const totalAposAporte = (investimento.valorInvestido || 0) + valorDigitado;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    try {
      if (!formData.valorAporte || parseFloat(formData.valorAporte) <= 0) {
        throw new Error("Insira um valor válido e maior que zero para o aporte.");
      }

      await aportar(investimento.id, parseFloat(formData.valorAporte));
      alert("Aporte realizado com sucesso!");
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Novo Aporte
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Adicione mais dinheiro ao seu investimento. O valor será descontado do saldo da sua conta vinculada.
      </p>
      <hr className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {erro}
          </div>
        )}

        {/* RESUMO DO INVESTIMENTO */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col gap-1">
          <h3 className="font-bold text-blue-900">{investimento.ativo}</h3>
          <p className="text-sm text-blue-800">
            <strong>Tipo:</strong> {investimento.tipo.replace("_", " ")}
          </p>
          <p className="text-sm text-blue-800">Banco: {investimento.conta.instituicao}</p>
          <p className="text-sm text-blue-800">
            <strong>Saldo Atual:</strong> R$ {(investimento.valorInvestido || 0).toFixed(2)}
          </p>
        </div>

        {/* INPUT DE VALOR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Qual valor deseja aportar? (R$)
          </label>
          <Input
            type="number"
            name="valorAporte"
            value={formData.valorAporte}
            onChange={handleChange}
            placeholder="Ex: 500.00"
            step="0.01"
            min={0.01}
            required
            autoFocus
          />
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={aporteEmProgresso}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={aporteEmProgresso || valorDigitado <= 0}
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {aporteEmProgresso ? "Processando..." : "Confirmar Aporte"}
          </button>
        </div>
      </form>
    </div>
  );
}