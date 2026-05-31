"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { listaBancosPopulares, useContas } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore";

interface ContaModalProps {
  conta?: Partial<Conta> | Conta;
  id?: number;
}

const TIPOS_CONTA: Record<string, { label: string; cor: string }> = {
  corrente: { label: "Conta Corrente", cor: "bg-blue-100 text-blue-800" },
  poupanca: { label: "Poupança", cor: "bg-green-100 text-green-800" },
  salario: { label: "Conta Salário", cor: "bg-purple-100 text-purple-800" },
  investimento: { label: "Investimento", cor: "bg-amber-100 text-amber-800" },
};

export default function ContaModal({ conta: contaInicial, id }: ContaModalProps) {
  const [conta, setConta] = useState<Conta | null>(
    contaInicial && "instituicao" in contaInicial ? (contaInicial as Conta) : null
  );
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { closeModal, openModal } = useModalStore();
  const { deletarConta, reativarConta, deletandoId, atualizandoId, buscarContaPorId } = useContas();

  useEffect(() => {
    const isContaCompleta = contaInicial && "instituicao" in contaInicial && "saldo" in contaInicial;

    if (isContaCompleta) {
      setConta(contaInicial as Conta);
      return;
    }

    const contaId = contaInicial?.id || id;
    if (!contaId) {
      setError("ID da conta não fornecido.");
      return;
    }

    (async () => {
      setCarregando(true);
      setError(null);
      try {
        const contaCompleta = await buscarContaPorId(Number(contaId));
        if (contaCompleta) {
          setConta(contaCompleta);
        } else {
          throw new Error("Detalhes da conta não encontrados.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar detalhes da conta";
        setError(message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [contaInicial, id]);

  const getBancoLogo = (instituicao: string) => {
    const banco = listaBancosPopulares.find(
      (b) => b.nome.toLowerCase() === instituicao.toLowerCase()
    );
    return banco?.logo || "/bancos/default.png";
  };

  const formatarSaldo = (saldo: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(saldo);

  const getTipoConta = (tipo?: string) => {
    const tipoNorm = tipo?.toLowerCase() || "";
    return TIPOS_CONTA[tipoNorm] || {
      label: tipo || "Não definido",
      cor: "bg-gray-100 text-gray-800",
    };
  };

  const handleDelete = async () => {
    if (!conta) return;
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
    if (!conta) return;
    setError(null);
    try {
      await reativarConta(conta);
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    }
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-500">Buscando detalhes da conta...</p>
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="space-y-6">
        <p className="text-center font-medium text-red-500">
          {error || "Conta não encontrada"}
        </p>
      </div>
    );
  }

  const tipoConta = getTipoConta(conta.tipo);
  const loading = deletandoId === conta.id || atualizandoId === conta.id;
  const buttonBase =
    "flex-1 rounded-lg px-4 py-3 font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h2 className="text-2xl font-bold text-gray-900">{conta.instituicao}</h2>
          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${tipoConta.cor}`}>
            {tipoConta.label}
          </span>
        </div>
      </div>

      {/* Saldo */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
        <p className={`mt-2 text-4xl font-bold ${conta.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
          {formatarSaldo(conta.saldo)}
        </p>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Instituição</p>
          <p className="mt-2 truncate text-lg font-semibold text-gray-900">{conta.instituicao}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tipo</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{tipoConta.label}</p>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-3 pt-4">
        {conta.ativa ? (
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`${buttonBase} bg-gray-200 text-gray-500 hover:text-red-600 hover:shadow-lg`}
          >
            {deletandoId === conta.id ? "Excluindo..." : "Excluir"}
          </button>
        ) : (
          <button
            onClick={handleReactivate}
            disabled={loading}
            className={`${buttonBase} bg-green-600 text-white hover:bg-green-700 hover:shadow-lg`}
          >
            {atualizandoId === conta.id ? "Reativando..." : "↻ Reativar"}
          </button>
        )}

        {conta.ativa && (
          <button
            onClick={() => openModal("updateConta", conta)}
            disabled={loading}
            className={`${buttonBase} bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg`}
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}