"use client";

import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { useModalStore } from "@/store/useModalStore";
import { useTransacoes } from "@/hooks/useTransacoes";
import { Transacao } from "@/interfaces/Transacao";

interface TransacaoModalProps {
  transacao: Transacao;
}

export default function TransacaoModal({ transacao }: TransacaoModalProps) {
  const { origemDestino, descricao, valor, dataTransacao, conta, categoria } = transacao;
  const isEntrada = categoria.tipo === "ENTRADA";
  const { deletarTransacao } = useTransacoes();
  const { closeModal, openModal } = useModalStore();

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(data);
  };

  const formatarValor = (val: number) =>
    val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handleExcluir = () => {
    deletarTransacao(transacao.id);
    closeModal();
  };

  const handleEditar = () => {
    openModal("updateTransacao", transacao);
  };

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
            isEntrada ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isEntrada ? (
            <FaArrowCircleUp size={24} className="text-green-600" />
          ) : (
            <FaArrowCircleDown size={24} className="text-red-600" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEntrada ? "Entrada" : "Saída"}
          </h2>
          <p className="text-sm font-medium text-gray-500">{categoria.nome}</p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Valor */}
        <div className="col-span-1 sm:col-span-2 rounded-xl bg-gray-50 p-4 border border-gray-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Valor
          </label>
          <p
            className={`text-3xl font-bold ${
              isEntrada ? "text-green-600" : "text-red-600"
            }`}
          >
            {isEntrada ? "+ " : "- "}
            {formatarValor(valor)}
          </p>
        </div>

        {/* Origem/Destino */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Origem/Destino
          </label>
          <p className="text-base font-medium text-gray-900 break-words">
            {origemDestino}
          </p>
        </div>

        {/* Conta */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Conta
          </label>
          <p className="text-base font-medium text-gray-900 break-words">
            {conta.instituicao}
          </p>
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Data da Transação
          </label>
          <p className="text-base font-medium text-gray-900">
            {formatarData(dataTransacao)}
          </p>
        </div>

        {/* Descrição */}
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Descrição
          </label>
          <p className="text-base font-medium text-gray-900 break-words whitespace-pre-wrap">
            {descricao || "—"}
          </p>
        </div>

        {/* Ações */}
        <div className="col-span-1 sm:col-span-2 mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={handleExcluir}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Excluir
          </button>
          <button
            onClick={handleEditar}
            className="rounded-lg bg-[var(--primary-color)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Editar Transação
          </button>
        </div>
      </div>
    </div>
  );
}