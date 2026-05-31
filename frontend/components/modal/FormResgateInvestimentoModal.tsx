"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Input from "../forms/Input";
import { Investimento } from "@/interfaces/Investimento";
import { ArrowDownLeft, AlertTriangle } from "lucide-react";

interface FormResgateInvestimentoProps {
  investimento: Investimento;
}

export default function FormResgateInvestimentoModal({
  investimento,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    try {
      if (!formData.valorResgatado || valorResgatado <= 0) {
        throw new Error("O valor de resgate deve ser maior que zero.");
      }
      if (formData.saldoRemanescente === "" || saldoRemanescente < 0) {
        throw new Error(
          "Informe o saldo remanescente válido (digite 0 se resgatar tudo).",
        );
      }

      await resgatar(investimento.id, valorResgatado, saldoRemanescente);
      alert("Resgate realizado com sucesso!");
      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  const isZerarCarteira =
    formData.saldoRemanescente !== "" && saldoRemanescente === 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <ArrowDownLeft className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Resgatar Investimento
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Retire o dinheiro da sua aplicação e atualize o saldo real da sua
        corretora.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {erro && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {erro}
          </div>
        )}

        {/* RESUMO DO INVESTIMENTO */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">{investimento.ativo}</h3>
          <p className="text-sm text-gray-600">
            Saldo registrado no app:{" "}
            <span className="font-bold text-gray-900">
              R$ {valorAtualRegistrado.toFixed(2)}
            </span>
          </p>
        </div>

        {/* INPUTS */}
        <Input
          label="Qual valor você está sacando? (R$)"
          type="number"
          name="valorResgatado"
          value={formData.valorResgatado}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min={0.01}
          required
          autoFocus
        />

        <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
          <Input
            label="Quanto sobrou na corretora? (R$)"
            type="number"
            name="saldoRemanescente"
            value={formData.saldoRemanescente}
            onChange={handleChange}
            placeholder="Ex: 650.00 ou 0"
            step="0.01"
            min={0}
            required
          />
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            Consulte o app da corretora e digite o valor exato restante. Digite{" "}
            <strong>0</strong> se resgatar tudo.
          </p>

          {isZerarCarteira && (
            <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Este investimento será marcado como inativo ao zerar o saldo.
              </span>
            </div>
          )}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={resgateEmProgresso}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              resgateEmProgresso ||
              formData.valorResgatado === "" ||
              formData.saldoRemanescente === ""
            }
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {resgateEmProgresso ? "Processando..." : "Confirmar Resgate"}
          </button>
        </div>
      </form>
    </div>
  );
}
