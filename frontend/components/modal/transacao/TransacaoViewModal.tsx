"use client";

import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { useModalStore } from "@/store/useModalStore";
import { useTransacoes } from "@/hooks/useTransacoes";
import { Transacao } from "@/interfaces/Transacao";
import { getIconeCategoria } from "@/lib/categoriaUtils";
import { toast } from "sonner";

interface TransacaoViewModalProps {
  transacao: Transacao;
}

export default function TransacaoViewModal({ transacao }: TransacaoViewModalProps) {
  const { origemDestino, descricao, valor, dataTransacao, conta, categoria } = transacao;
  const isEntrada = categoria.tipo === "ENTRADA";
  const { deletarTransacao } = useTransacoes();
  const { closeModal, openModal } = useModalStore();

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
  };

  const formatarValor = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleExcluir = () => {
    deletarTransacao(transacao.id);
    toast.success("Transação removida com sucesso!");
    closeModal();
  };

  const handleEditar = () => {
    openModal("updateTransacao", transacao);
  };

  const handleVerConta = () => {
    openModal("conta", conta);
  };

  const handleVerCategoria = () => {
    openModal("categoria", categoria.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl shadow-sm border ${isEntrada
              ? "bg-[var(--success-color)]/10 border-[var(--success-color)]/20"
              : "bg-[var(--danger-color)]/10 border-[var(--danger-color)]/20"
            }`}
        >
          {isEntrada ? (
            <FaArrowCircleUp size={32} className="text-[var(--success-color)]" />
          ) : (
            <FaArrowCircleDown size={32} className="text-[var(--danger-color)]" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEntrada ? "Entrada" : "Saída"}
          </h2>
          <button onClick={handleVerCategoria}
            className={`mt-2 rounded-full px-3 py-1 text-sm font-medium border cursor-pointer flex gap-2 ${isEntrada
                ? "bg-[var(--success-color)]/10 text-[var(--success-color)] border-[var(--success-color)]/20"
                : "bg-[var(--danger-color)]/10 text-[var(--danger-color)] border-[var(--danger-color)]/20"
              }`}
          >
            {getIconeCategoria(categoria.nome)}
            {categoria.nome}
          </button>
        </div>
      </div>

      {/* Valor */}
      <div
        className={`rounded-xl p-6 flex flex-col items-center justify-center text-center border ${isEntrada
            ? "bg-[var(--success-color)]/5 border-[var(--success-color)]/20"
            : "bg-[var(--danger-color)]/5 border-[var(--danger-color)]/20"
          }`}
      >
        <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">Valor da Transação</p>
        <p
          className={`mt-2 text-4xl font-bold ${isEntrada ? "text-[var(--success-color)]" : "text-[var(--danger-color)]"
            }`}
        >
          {isEntrada ? "+ " : "- "}
          {formatarValor(valor)}
        </p>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-3">
        <button
          className="col-span-2 cursor-pointer rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] p-4 text-left transition-colors"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {isEntrada ? "Origem" : "Destino"}
          </p>
          <p className="mt-1 break-words text-lg font-semibold text-[var(--text-primary)]">
            {origemDestino}
          </p>
        </button>

        <button
          onClick={handleVerConta}
          className="cursor-pointer rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] p-4 text-left transition-colors hover:border-[var(--primary-color)]/50 hover:bg-[var(--primary-color)]/5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Conta</p>
          <p className="mt-1 text-lg font-semibold text-[var(--primary-color)]">{conta.instituicao}</p>
        </button>

        <div className="rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Data</p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
            {formatarData(dataTransacao)}
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="max-h-48 overflow-y-auto rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Descrição</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-lg text-[var(--text-secondary)]">
          {descricao || "—"}
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleExcluir}
          className="cursor-pointer flex-1 rounded-xl bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] px-4 py-3 font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--danger-color)]/10 hover:border-[var(--danger-color)]/30 hover:text-[var(--danger-color)]"
        >
          Excluir
        </button>
        <button
          onClick={handleEditar}
          className="cursor-pointer flex-1 rounded-xl bg-[var(--primary-color)] px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] hover:shadow-lg"
        >
          Editar
        </button>
      </div>
    </div>
  );
}