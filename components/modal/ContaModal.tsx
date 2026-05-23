"use client";

import { useState } from "react";
import { listaBancosPopulares, useContas } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import Image from "next/image";
import { useModalStore } from "@/store/useModalStore";

interface ContaModalProps {
  conta: Conta;
}

export default function ContaModal({ conta }: ContaModalProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal, openModal } = useModalStore();
  const { deletarConta, reativarConta, deletandoId, atualizandoId } =
    useContas();

  const handleDelete = async () => {
    setError(null);

    try {
      await deletarConta(conta.id);
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    }
  };

  const handleReactivate = async () => {
    setError(null);

    try {
      await reativarConta(conta);
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    }
  };

  const getBancoLogo = (instituicao: string) => {
    const banco = listaBancosPopulares.find(
      (b) => b.nome.toLowerCase() === conta.instituicao.toLowerCase(),
    );
    return banco?.logo || "/bancos/default.png";
  };

  const formatarSaldo = (saldo: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(saldo);
  };

  const getTipoConta = (tipo: string) => {
    const tipos: Record<string, { label: string; cor: string }> = {
      corrente: { label: "Conta Corrente", cor: "bg-blue-100 text-blue-800" },
      poupanca: { label: "Poupança", cor: "bg-green-100 text-green-800" },
      salario: { label: "Conta Salário", cor: "bg-purple-100 text-purple-800" },
      investimento: {
        label: "Investimento",
        cor: "bg-amber-100 text-amber-800",
      },
    };
    return (
      tipos[tipo.toLowerCase()] || {
        label: tipo,
        cor: "bg-gray-100 text-gray-800",
      }
    );
  };

  const tipoConta = getTipoConta(conta.tipo);

  const getStatusConta = () => {
    if (conta.ativa) {
      return {
        label: "Conta ativa",
        cor: "border-green-200 bg-green-50",
        dot: "bg-green-500",
        text: "text-green-800",
      };
    } else {
      return {
        label: "Conta desativada",
        cor: "border-gray-300 bg-gray-50",
        dot: "bg-gray-400",
        text: "text-gray-700",
      };
    }
  };

  const status = getStatusConta();

  return (
    <div className="space-y-6">
      {/* Header com logo */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg bg-white p-2 shadow-md">
          <Image
            src={getBancoLogo(conta.instituicao)}
            alt={conta.instituicao}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {conta.instituicao}
          </h2>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${tipoConta.cor}`}
          >
            {tipoConta.label}
          </span>
        </div>
      </div>

      {/* Saldo em destaque */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
        <p
          className={`mt-2 text-4xl font-bold ${conta.saldo >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {formatarSaldo(conta.saldo)}
        </p>
      </div>

      {/* Informações adicionais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Instituição
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {conta.instituicao}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Tipo
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {tipoConta.label}
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={`flex items-center gap-2 rounded-lg border p-4 ${status.cor}`}
      >
        <div className={`h-3 w-3 rounded-full ${status.dot}`}></div>
        <span className={`text-sm font-medium ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        {conta.ativa ? (
          <button
            onClick={handleDelete}
            disabled={deletandoId === conta.id || atualizandoId === conta.id}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-400 shadow-md transition-all hover:text-red-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deletandoId === conta.id ? "Processando..." : "Excluir"}
          </button>
        ) : (
          <button
            onClick={handleReactivate}
            disabled={deletandoId === conta.id || atualizandoId === conta.id}
            className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {atualizandoId === conta.id ? "Processando..." : "↻ Reativar"}
          </button>
        )}
        {conta.ativa && (
          <button
            onClick={() => openModal("updateConta", conta)}
            disabled={deletandoId === conta.id || atualizandoId === conta.id}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
