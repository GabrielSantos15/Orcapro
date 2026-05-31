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
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
  };

  const formatarValor = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleExcluir = () => {
    deletarTransacao(transacao.id);
    closeModal();
  };

  const handleEditar = () => {
    openModal("updateTransacao", transacao);
  };

  const handleVerConta = () => {
    openModal("conta", conta);
  };

  const handleVerCategoria = () => {
    openModal("categoria", categoria);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl shadow-md ${
            isEntrada ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isEntrada ? (
            <FaArrowCircleUp size={32} className="text-green-600" />
          ) : (
            <FaArrowCircleDown size={32} className="text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEntrada ? "Entrada" : "Saída"}
          </h2>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
              isEntrada ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {categoria.nome}
          </span>
        </div>
      </div>

      {/* Valor */}
      <div
        className={`rounded-xl p-6 shadow-sm ${
          isEntrada
            ? "bg-gradient-to-r from-green-50 to-emerald-50"
            : "bg-gradient-to-r from-red-50 to-rose-50"
        }`}
      >
        <p className="text-sm font-medium text-gray-600">Valor da Transação</p>
        <p
          className={`mt-2 text-4xl font-bold ${
            isEntrada ? "text-green-600" : "text-red-600"
          }`}
        >
          {isEntrada ? "+ " : "- "}
          {formatarValor(valor)}
        </p>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {}}
          className="col-span-2 cursor-pointer rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Origem/Destino
          </p>
          <p className="mt-2 break-words text-lg font-semibold text-gray-900">
            {origemDestino}
          </p>
        </button>

        <button
          onClick={handleVerConta}
          className="cursor-pointer rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-blue-50"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Conta</p>
          <p className="mt-2 text-lg font-semibold text-blue-600">{conta.instituicao}</p>
        </button>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Data</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {formatarData(dataTransacao)}
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Descrição</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-lg font-semibold text-gray-900">
          {descricao || "—"}
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleExcluir}
          className="flex-1 rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-500 shadow-md transition-all hover:text-red-600 hover:shadow-lg"
        >
          Excluir
        </button>
        <button
          onClick={handleEditar}
          className="flex-1 rounded-lg bg-[var(--primary-color)] px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] hover:shadow-lg"
        >
          Editar
        </button>
      </div>
    </div>
  );
}