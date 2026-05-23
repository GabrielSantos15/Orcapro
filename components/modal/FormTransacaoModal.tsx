"use client";

import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import Input from "../forms/Input";

interface FormTransacaoModalProps {
  transacao?: Transacao | null;
}

export default function FormTransacaoModal({ transacao }: FormTransacaoModalProps) {
  const { closeModal, openModal } = useModalStore();
  const { categorias, carregando: carregandoCategorias } = useCategorias();
  const { contas, carregando: carregandoContas } = useContas();
  const { createTransacao, updateTransacao, criandoTransacao, atualizandoId } = useTransacoes();

  const isEditMode = !!transacao;
  const [tipoTransacao, setTipoTransacao] = useState<string>("ENTRADA");
  const [formData, setFormData] = useState({
    contaId: "",
    categoriaId: "",
    origemDestino: "",
    descricao: "",
    valor: "",
    dataTransacao: "",
  });

  const carregando = carregandoContas || carregandoCategorias;
  const categoriasFiltradas = categorias.filter((cat) => cat.tipo === tipoTransacao);

  useEffect(() => {
    if (transacao) {
      const dataFormatada = transacao.dataTransacao
        ? new Date(transacao.dataTransacao).toISOString().split("T")[0]
        : "";

      setTipoTransacao(transacao.categoria?.tipo || "ENTRADA");
      setFormData({
        contaId: String(transacao.conta?.id) || "",
        categoriaId: String(transacao.categoria?.id) || "",
        origemDestino: transacao.origemDestino || "",
        descricao: transacao.descricao || "",
        valor: String(transacao.valor) || "",
        dataTransacao: dataFormatada,
      });
    }
  }, [transacao]);

  useEffect(() => {
    if (!transacao) {
      setFormData((prev) => ({ ...prev, categoriaId: "" }));
    }
  }, [tipoTransacao, transacao]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      tipo: tipoTransacao,
      contaId: formData.contaId,
      categoriaId: formData.categoriaId,
      origemDestino: formData.origemDestino,
      descricao: formData.descricao,
      valor: formData.valor,
      dataTransacao: formData.dataTransacao,
    };

    try {
      if (isEditMode) {
        await updateTransacao(transacao.id, payload);
        alert("Transação atualizada com sucesso!");
      } else {
        await createTransacao(payload);
        alert("Transação criada com sucesso!");
      }
      closeModal();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : `Erro ao ${isEditMode ? "atualizar" : "criar"} transação`
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        {isEditMode ? "Editar Transação" : "Nova Transação"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {isEditMode
          ? "Altere os dados da transação abaixo."
          : "Preencha os dados para registrar no sistema."}
      </p>
      <hr />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Tipo de Transação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transação
          </label>
          <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setTipoTransacao("ENTRADA")}
              className={`flex-1 px-4 py-3 text-center font-semibold transition-colors ${
                tipoTransacao === "ENTRADA"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipoTransacao("SAIDA")}
              className={`flex-1 px-4 py-3 text-center font-semibold transition-colors ${
                tipoTransacao === "SAIDA"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              Saída
            </button>
          </div>
        </div>

        {/* Conta */}
        <div>
          <label htmlFor="conta" className="block text-sm font-medium text-gray-700">
            Conta
          </label>
          <select
            id="conta"
            name="conta"
            value={formData.contaId}
            onChange={(e) => setFormData({ ...formData, contaId: e.target.value })}
            required
            disabled={carregandoContas}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
          >
            <option value="" disabled>
              {carregandoContas ? "Carregando contas..." : "Selecione uma conta"}
            </option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.instituicao} - {conta.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoria ({tipoTransacao.toLowerCase()})
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            required
            disabled={carregandoCategorias}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white disabled:bg-gray-100"
          >
            <option value="" disabled>
              {carregandoCategorias ? "Carregando categorias..." : "Selecione uma categoria"}
            </option>
            {categoriasFiltradas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="mt-2 text-blue-600 hover:underline text-sm"
            onClick={() => openModal("categoria")}
          >
            + Adicionar Categoria
          </button>
        </div>

        {/* Origem / Destino */}
        <div>
          <label htmlFor="origem" className="block text-sm font-medium text-gray-700">
            {tipoTransacao === "ENTRADA" ? "Origem (Quem pagou?)" : "Destino (Para quem pagou?)"}
          </label>
          <Input
            type="text"
            id="origem"
            name="origemDestino"
            value={formData.origemDestino}
            onChange={(e) => setFormData({ ...formData, origemDestino: e.target.value })}
            placeholder={tipoTransacao === "ENTRADA" ? "Ex: Empresa X, Cliente Y" : "Ex: Supermercado, Padaria"}
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva a transação (opcional)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            rows={2}
          />
        </div>

        {/* Valor e Data */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
              Valor (R$)
            </label>
            <Input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min={0.01}
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <Input
              type="date"
              id="data"
              name="dataTransacao"
              value={formData.dataTransacao}
              onChange={(e) => setFormData({ ...formData, dataTransacao: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={criandoTransacao || atualizandoId !== null || carregando}
          className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-opacity mt-6"
        >
          {criandoTransacao || atualizandoId !== null
            ? "Salvando..."
            : isEditMode
              ? "Salvar Alterações"
              : "Criar Transação"}
        </button>
      </form>
    </div>
  );
}