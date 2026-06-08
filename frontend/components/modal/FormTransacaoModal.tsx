"use client";

import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import Input from "../forms/Input";
import Select from "../forms/Select"; // Certifique-se do caminho correto
import Textarea from "../forms/Textarea"; // Certifique-se do caminho correto
import { toast } from "sonner";

interface FormTransacaoModalProps {
  transacao?: Transacao | null;
}

export default function FormTransacaoModal({
  transacao,
}: FormTransacaoModalProps) {
  const { closeModal, openModal } = useModalStore();
  const { categorias, carregando: carregandoCategorias } = useCategorias();
  const { contas, carregando: carregandoContas } = useContas();
  const { createTransacao, updateTransacao, criandoTransacao, atualizandoId } =
    useTransacoes();

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
  const categoriasFiltradas = categorias.filter(
    (cat) => cat.tipo === tipoTransacao,
  );

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
        toast.success("Transação atualizada com sucesso!");
      } else {
        await createTransacao(payload);
        toast.success("Transação criada com sucesso!");
      }
      closeModal();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : `Erro ao ${isEditMode ? "atualizar" : "criar"} transação`,
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        {isEditMode ? "Editar Transação" : "Nova Transação"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {isEditMode
          ? "Altere os dados da transação abaixo."
          : "Preencha os dados para registrar no sistema."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle Tipo de Transação */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setTipoTransacao("ENTRADA")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tipoTransacao === "ENTRADA"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Entrada (Receita)
          </button>
          <button
            type="button"
            onClick={() => setTipoTransacao("SAIDA")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tipoTransacao === "SAIDA"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Saída (Despesa)
          </button>
        </div>

        {/* Conta */}
        <div>
          <Select
            label="Conta"
            id="conta"
            name="conta"
            value={formData.contaId}
            onChange={(e) =>
              setFormData({ ...formData, contaId: e.target.value })
            }
            required
            disabled={carregandoContas}
          >
            <option value="" disabled>
              {carregandoContas
                ? "Carregando contas..."
                : "Selecione uma conta"}
            </option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.instituicao} - {conta.tipo}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={() => openModal("createConta")}
            className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            + Criar nova conta
          </button>
        </div>

        {/* Categoria */}
        <div>
          <Select
            label={`Categoria de ${tipoTransacao === "ENTRADA" ? "Entrada" : "Saída"}`}
            id="categoria"
            name="categoria"
            value={formData.categoriaId}
            onChange={(e) =>
              setFormData({ ...formData, categoriaId: e.target.value })
            }
            required
            disabled={carregandoCategorias}
          >
            <option value="" disabled>
              {carregandoCategorias
                ? "Carregando categorias..."
                : "Selecione uma categoria"}
            </option>
            {categoriasFiltradas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={() => openModal("createCategoria")}
            className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            + Criar nova categoria
          </button>
        </div>

        {/* Origem / Destino */}
        <Input
          label={
            tipoTransacao === "ENTRADA"
              ? "Origem (Quem pagou?)"
              : "Destino (Para onde foi?)"
          }
          type="text"
          id="origem"
          name="origemDestino"
          value={formData.origemDestino}
          onChange={(e) =>
            setFormData({ ...formData, origemDestino: e.target.value })
          }
          placeholder={
            tipoTransacao === "ENTRADA"
              ? "Ex: Empresa, Freelance"
              : "Ex: Supermercado, Padaria"
          }
        />

        {/* Valor e Data */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label="Valor (R$)"
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              placeholder="0.00"
              step="0.01"
              min={0.01}
              required
            />
          </div>

          <div className="flex-1">
            <Input
              label="Data"
              type="date"
              id="data"
              name="dataTransacao"
              value={formData.dataTransacao}
              onChange={(e) =>
                setFormData({ ...formData, dataTransacao: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Descrição */}
        <Textarea
          label="Descrição (Opcional)"
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          placeholder="Detalhes adicionais sobre a transação..."
          rows={2}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={criandoTransacao || atualizandoId !== null || carregando}
          className="w-full mt-4 bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {criandoTransacao || atualizandoId !== null
            ? "Processando..."
            : isEditMode
              ? "Salvar Alterações"
              : "Registrar Transação"}
        </button>
      </form>
    </div>
  );
}
