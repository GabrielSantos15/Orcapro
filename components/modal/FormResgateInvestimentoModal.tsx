"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Input from "../forms/Input";
import { Investimento } from "@/interfaces/Investimento"; 

interface FormResgateInvestimentoProps {
  investimento: Investimento;
}

export default function FormResgateInvestimentoModal({
  investimento
}: FormResgateInvestimentoProps) {
  const { closeModal } = useModalStore();
  const { resgatar, resgateEmProgresso } = useInvestimentos();
  
  const [formData, setFormData] = useState({
    valorResgatado: "",
    saldoRemanescente: "",
  });

  const [erro, setErro] = useState<string | null>(null);

  const valorAtualRegistrado = investimento.valorInvestido || 0;
  const valorResgatado = parseFloat(formData.valorResgatado) || 0;
  const saldoRemanescente = parseFloat(formData.saldoRemanescente) || 0;

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
      if (!formData.valorResgatado || valorResgatado <= 0) {
        throw new Error("O valor de resgate deve ser maior que zero.");
      }

      if (formData.saldoRemanescente === "" || saldoRemanescente < 0) {
        throw new Error("Informe o saldo remanescente válido. (Pode ser zero se resgatar tudo).");
      }

      await resgatar(investimento.id, valorResgatado, saldoRemanescente);
      alert("Resgate realizado com sucesso!");
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  // Verifica se o usuário digitou explicitamente "0" no saldo remanescente
  const isZerarCarteira = formData.saldoRemanescente !== "" && saldoRemanescente === 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Resgatar Investimento
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Retire o dinheiro da sua aplicação e atualize o saldo real da sua corretora.
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
            <strong>Saldo registrado no app:</strong> R$ {valorAtualRegistrado.toFixed(2)}
          </p>
          <p className="text-xs text-blue-700 italic mt-1">
            * O valor real na corretora pode ser diferente devido aos rendimentos.
          </p>
        </div>

        {/* INPUT DE VALOR RESGATADO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Qual valor você está sacando para sua conta? (R$)
          </label>
          <Input
            type="number"
            name="valorResgatado"
            value={formData.valorResgatado}
            onChange={handleChange}
            placeholder="Ex: 500.00"
            step="0.01"
            min={0.01}
            required
            autoFocus
          />
        </div>

        {/* INPUT DE SALDO REMANESCENTE */}
        <div className="p-4 rounded-lg border bg-gray-50 border-gray-200 mt-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            E quanto sobrou lá na corretora agora? (R$)
          </label>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Abra o app da sua corretora e digite o valor exato que restou após esse saque, já contabilizando os rendimentos. Digite <strong>0</strong> se sacou tudo.
          </p>
          <Input
            type="number"
            name="saldoRemanescente"
            value={formData.saldoRemanescente}
            onChange={handleChange}
            placeholder="Ex: 650.00 ou 0.00"
            step="0.01"
            min={0}
            required
          />
          
          {/* AVISO DE INATIVAÇÃO SE ZERAR */}
          {isZerarCarteira && (
            <p className="text-xs text-amber-700 mt-3 font-medium bg-amber-100 p-2 rounded border border-amber-200">
              ⚠️ Como você informou que o saldo restante é 0, este investimento será marcado como inativo.
            </p>
          )}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={resgateEmProgresso}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={resgateEmProgresso || formData.valorResgatado === "" || formData.saldoRemanescente === ""}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {resgateEmProgresso ? "Processando..." : "Confirmar Resgate"}
          </button>
        </div>
      </form>
    </div>
  );
}