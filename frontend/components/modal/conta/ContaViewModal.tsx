"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { listaBancosPopulares, useContas } from "@/hooks/useContas";
import { Conta } from "@/interfaces/Conta";
import { useModalStore } from "@/store/useModalStore";
import { Building2 } from "lucide-react";
import { getLogoBanco } from "@/lib/contaUtils";

interface ContaModalProps {
  conta?: Partial<Conta> | Conta;
  id?: number;
}

const TIPOS_CONTA: Record<string, { label: string; cor: string }> = {
  corrente: { label: "Conta Corrente", cor: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  poupanca: { label: "Poupança", cor: "bg-green-500/10 text-green-500 border-green-500/20" },
  salario: { label: "Conta Salário", cor: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  investimento: { label: "Investimento", cor: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

export default function ContaViewModal({ conta: contaInicial, id }: ContaModalProps) {
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

  const formatarSaldo = (saldo: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(saldo);

  const getTipoConta = (tipo?: string) => {
    const tipoNorm = tipo?.toLowerCase() || "";
    return TIPOS_CONTA[tipoNorm] || {
      label: tipo || "Não definido",
      cor: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]",
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent"></div>
        <p className="text-sm font-medium text-[var(--text-muted)]">Buscando detalhes da conta...</p>
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="space-y-6">
        <p className="text-center font-medium text-[var(--danger-color)]">
          {error || "Conta não encontrada"}
        </p>
      </div>
    );
  }

  const tipoConta = getTipoConta(conta.tipo);
  const loading = deletandoId === conta.id || atualizandoId === conta.id;
  const logoBanco = getLogoBanco(conta.instituicao);

  return (
    <div className="space-y-6">
      
      {/* HEADER DA CONTA */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="relative flex h-16 w-16 items-center justify-center flex-shrink-0 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm overflow-hidden">
          {logoBanco ? (
            <Image
              src={logoBanco}
              alt={conta.instituicao}
              fill
              className="object-contain"
            />
          ) : (
            <Building2 className="text-[var(--text-secondary)] w-8 h-8" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">{conta.instituicao}</h2>
          <span className={`mt-1 inline-block rounded-lg px-2.5 py-1 text-xs font-semibold border ${tipoConta.cor}`}>
            {tipoConta.label}
          </span>
        </div>
      </div>

      {/* CARD DE SALDO */}
      <div className="p-5 bg-[var(--bg-secondary)]/40 rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center text-center">
        <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-1">Saldo Atual Registrado</p>
        <p className={`text-4xl font-bold ${conta.saldo >= 0 ? "text-[var(--text-primary)]" : "text-[var(--danger-color)]"}`}>
          {formatarSaldo(conta.saldo)}
        </p>
      </div>

      {/* INFORMAÇÕES EXTRAS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1">Status da Conta</p>
          <div className="flex items-center gap-2">
             <span className={`h-2.5 w-2.5 rounded-full ${conta.ativa ? 'bg-[var(--success-color)]' : 'bg-[var(--danger-color)]'}`}></span>
             <p className="text-sm font-semibold text-[var(--text-primary)]">{conta.ativa ? 'Ativa' : 'Desativada'}</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-color)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1">Tipo Registrado</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{tipoConta.label}</p>
        </div>
      </div>

      {/* MENSAGEM DE ERRO (Com opacidade para não "gritar" na tela) */}
      {error && (
        <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm border border-[var(--danger-color)]/20 font-medium">
          {error}
        </div>
      )}

      {/* BOTÕES DE AÇÃO */}
      <div className="flex gap-3 pt-2">
        {conta.ativa ? (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--danger-color)]/10 hover:text-[var(--danger-color)] hover:border-[var(--danger-color)]/30 font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {deletandoId === conta.id ? "Excluindo..." : "Excluir Conta"}
          </button>
        ) : (
          <button
            onClick={handleReactivate}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--success-color)] text-white rounded-xl hover:brightness-110 font-semibold transition disabled:opacity-50 shadow-md hover:shadow-lg cursor-pointer"
          >
            {atualizandoId === conta.id ? "Reativando..." : "↻ Reativar Conta"}
          </button>
        )}

        {conta.ativa && (
          <button
            onClick={() => {
              closeModal(); 
              setTimeout(() => openModal("updateConta", conta), 100); 
            }}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--primary-color)] text-white rounded-xl hover:bg-[var(--primary-hover)] font-semibold transition disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
          >
            Editar Conta
          </button>
        )}
      </div>
    </div>
  );
}