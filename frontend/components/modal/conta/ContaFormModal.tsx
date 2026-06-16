"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import { listaBancosPopulares } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";

import { toast } from "sonner";
import { Landmark } from "lucide-react";
import Select from "@/components/forms/Select";
import Input from "@/components/forms/Input";

interface ContaFormModalProps {
  conta?: Conta | null;
}

export default function ContaFormModal({ conta }: ContaFormModalProps) {
  const { closeModal, triggerUpdate } = useModalStore();
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!conta;

  const [isOutro, setIsOutro] = useState(false);

  const [formData, setFormData] = useState({
    instituicao: "",
    tipo: "CORRENTE",
    saldo: "",
  });

  const tiposConta = ["CORRENTE", "POUPANCA", "INVESTIMENTO"];

  useEffect(() => {
    if (conta) {
      setFormData({
        instituicao: conta.instituicao,
        tipo: conta.tipo,
        saldo: String(conta.saldo) || "",
      });

      const bancoDaLista = listaBancosPopulares.find(b => b.nome === conta.instituicao);
      setIsOutro(!bancoDaLista);
    }
  }, [conta]);

  const handleBankSelect = (nomeBanco: string) => {
    setIsOutro(false);
    setFormData({ ...formData, instituicao: nomeBanco });
  };

  const handleOutroSelect = () => {
    setIsOutro(true);
    setFormData({ ...formData, instituicao: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.instituicao.trim()) {
      toast.error("Por favor, selecione ou digite a instituição bancária.");
      return;
    }

    setSubmitting(true);

    try {
      let saldoLimpo = 0;
      if (!isEditMode && formData.saldo) {
        const valorSemPonto = formData.saldo.replace(/\./g, "");
        const valorComPontoDec = valorSemPonto.replace(",", ".");
        saldoLimpo = parseFloat(valorComPontoDec);
      }

      const contaData = isEditMode
        ? {
          instituicao: formData.instituicao,
          tipo: formData.tipo,
        }
        : {
          instituicao: formData.instituicao,
          tipo: formData.tipo,
          saldo: saldoLimpo,
        };

      const url = isEditMode ? `/api/conta/${conta?.id}` : "/api/conta";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contaData),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Conta atualizada com sucesso!" : "Conta criada com sucesso!");
        triggerUpdate();
        closeModal();
      } else {
        const error = await response.json();
        const errorMessage = error.error || `Falha ao ${isEditMode ? "atualizar" : "criar"} conta`;
        console.log(`Erro: ${errorMessage}`);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao enviar conta:", error);
      toast.error("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="aspect-square p-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white border border-[var(--border-color)] rounded-[var(--radius-md)]">
          <Landmark className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Conta" : "Nova Conta"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode
              ? "Altere os dados da sua conta bancária."
              : "Preencha os dados para cadastrar sua conta bancária."}
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-5">

        {/* SELEÇÃO DE INSTITUIÇÃO */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Instituição Bancária
          </label>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {listaBancosPopulares.map((banco) => (
              <button
                key={banco.id}
                type="button"
                onClick={() => handleBankSelect(banco.nome)}
                className={`flex flex-col items-center justify-center p-2 border rounded-[var(--radius-md)] transition-all cursor-pointer ${formData.instituicao === banco.nome && !isOutro
                    ? "border-[var(--primary-color)] bg-[var(--bg-secondary)] ring-1 ring-[var(--primary-color)]"
                    : "border-[var(--border-color)] bg-[var(--bg-input)]  hover:border-[var(--primary-color)]"
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
                <span className="text-[10px] font-medium text-[var(--text-secondary)] text-center leading-tight">
                  {banco.nome}
                </span>
              </button>
            ))}

            {/* Botão "Outro" */}
            <button
              type="button"
              onClick={handleOutroSelect}
              className={`flex flex-col col-span-4 items-center justify-center p-2 border rounded-[var(--radius-md)] transition-all ${isOutro
                  ? "border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] bg-[var(--bg-secondary)]"
                  : "border-[var(--border-color)] hover:border-[var(--primary-color)] bg-[var(--bg-input)] "
                }`}
            >
              <div className="w-8 h-8 mb-1 flex items-center justify-center bg-[var(--bg-secondary)] rounded-full">
                <span className="text-[var(--text-secondary)] font-bold text-lg">+</span>
              </div>
              <span className="text-[10px] font-medium text-[var(--text-secondary)] text-center leading-tight">
                Outro
              </span>
            </button>
          </div>

          {isOutro && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <Input
                label="Qual o nome do banco?"
                type="text"
                id="instituicao-custom"
                name="instituicao"
                value={formData.instituicao}
                onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                placeholder="Ex: Banco Inter, XP, Sicredi"
                required={isOutro}
              />
            </div>
          )}
        </div>

        {/* TIPO DE CONTA */}
        <Select
          label="Tipo de Conta"
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        >
          {tiposConta.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo === "POUPANCA" ? "Poupança" : tipo.charAt(0) + tipo.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>

        {/* SALDO INICIAL */}
        {!isEditMode && (
          <Input
            label="Saldo Inicial"
            type="number"
            isCurrency={true}
            id="saldo"
            name="saldo"
            value={formData.saldo}
            onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
            placeholder="0.00"
            step="0.01"
            required
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
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {submitting ? (isEditMode ? "Atualizando..." : "Criando...") : (isEditMode ? "Salvar Alterações" : "Criar Conta")}
          </button>
        </div>
      </form>
    </div>
  );
}