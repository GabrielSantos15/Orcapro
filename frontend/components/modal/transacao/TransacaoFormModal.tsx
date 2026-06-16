"use client";

import { useState, useEffect } from "react";
import { Transacao } from "@/interfaces/Transacao";
import { useModalStore } from "@/store/useModalStore";
import { useCategorias } from "@/hooks/useCategorias";
import { useContas } from "@/hooks/useContas";
import { useTransacoes } from "@/hooks/useTransacoes";
import Input from "../../forms/Input";
import Select from "../../forms/Select";
import Textarea from "../../forms/Textarea";
import { toast } from "sonner";
import { Receipt } from "lucide-react"; // Ícone para o Header

interface FormTransacaoModalProps {
  transacao?: Transacao | null;
}

export default function TransacaoFormModal({
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
        // Formatar o valor para ter duas casas decimais no edit mode, para a máscara inicializar bem
        valor: transacao.valor ? transacao.valor.toFixed(2) : "",
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

    let valorLimpo = 0;
    if (formData.valor) {
      const valorSemPonto = formData.valor.replace(/\./g, "");
      const valorComPontoDec = valorSemPonto.replace(",", ".");
      valorLimpo = parseFloat(valorComPontoDec);
    }

    const payload = {
      tipo: tipoTransacao,
      contaId: formData.contaId,
      categoriaId: formData.categoriaId,
      origemDestino: formData.origemDestino,
      descricao: formData.descricao,
      valor: valorLimpo,
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
      const msg = error instanceof Error ? error.message : `Erro ao ${isEditMode ? "atualizar" : "criar"} transação`;
      toast.error(msg);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]  bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white">
          <Receipt className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Transação" : "Nova Transação"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] ">
            {isEditMode
              ? "Altere os dados da transação abaixo."
              : "Preencha os dados para registrar no sistema."}
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TOGGLE TIPO DE TRANSAÇÃO */}
        <div className="flex p-1 gap-1 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl">
          <button
            type="button"
            onClick={() => setTipoTransacao("ENTRADA")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${tipoTransacao === "ENTRADA"
                ? "bg-[var(--success-color)]/10 text-[var(--success-color)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/40"
              }`}
          >
            Entrada (Receita)
          </button>
          <button
            type="button"
            onClick={() => setTipoTransacao("SAIDA")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${tipoTransacao === "SAIDA"
                ? "bg-[var(--danger-color)]/10 text-[var(--danger-color)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/40"
              }`}
          >
            Saída (Despesa)
          </button>
        </div>
        {/* CONTA E CATEGORIA (Lado a Lado) */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
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
                {carregandoContas ? "Carregando..." : "Selecione a conta"}
              </option>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.instituicao}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={() => openModal("createConta")}
              className="mt-2 text-xs font-semibold text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors self-start cursor-pointer"
            >
              + Criar conta
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <Select
              label="Categoria"
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
                {carregandoCategorias ? "Carregando..." : "Selecione a categoria"}
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
              className="mt-2 text-xs font-semibold text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors self-start cursor-pointer"
            >
              + Criar categoria
            </button>
          </div>
        </div>

        {/* ORIGEM / DESTINO */}
        <Input
          label={
            tipoTransacao === "ENTRADA"
              ? "Origem (Quem pagou?)"
              : "Destino (Para onde foi?)"
          }
          type="text"
          id="origem"
          required
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

        {/* VALOR E DATA */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            {/* Agora o input usa isCurrency para aplicar a máscara visualmente */}
            <Input
              label="Valor"
              type="number"
              isCurrency={true}
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="flex-1 flex flex-col">
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

        {/* DESCRIÇÃO */}
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

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={criandoTransacao || atualizandoId !== null || carregando}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={criandoTransacao || atualizandoId !== null || carregando}
            className={`cursor-pointer flex-1 text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${tipoTransacao === "ENTRADA"
              ? "bg-[var(--success-color)] hover:brightness-110"
              : "bg-[var(--danger-color)] hover:brightness-110"
              }`}
          >
            {criandoTransacao || atualizandoId !== null
              ? "Processando..."
              : isEditMode
                ? "Salvar Alterações"
                : "Registrar Transação"}
          </button>
        </div>
      </form>
    </div>
  );
}