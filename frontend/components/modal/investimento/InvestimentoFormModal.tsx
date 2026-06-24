"use client";

import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";
import Input from "../../forms/Input";
import Select from "../../forms/Select";
import { Investimento } from "@/interfaces/Investimento";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useContas } from "@/hooks/useContas";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner"; 

interface FormInvestimentoModalProps {
  investimento?: Investimento | null;
}

export default function InvestimentoFormModal({
  investimento,
}: FormInvestimentoModalProps) {
  const { closeModal } = useModalStore();
  const {
    createInvestimento,
    updateInvestimento,
    criandoInvestimento,
    atualizandoId,
  } = useInvestimentos();
  const { contas, carregando: loadingContas } = useContas();

  const isEditMode = !!investimento;
  const [erro, setErro] = useState<string | null>(null);
  const [saldoContaSelecionada, setSaldoContaSelecionada] = useState<number>(0);

  const [formData, setFormData] = useState({
    idConta: "",
    ativo: "",
    tipo: "RENDA_FIXA",
    valorInvestido: "",
    percentual: "",
    indicador: "CDI",
    dataAplicacao: new Date().toISOString().split("T")[0],
  });

  const tiposInvestimento = [
    "RENDA_FIXA",
    "RENDA_VARIAVEL",
    "CRIPTOMOEDAS",
    "FUNDOS",
    "OUTROS",
  ];
  
  const indicadores = [
    "CDI",
    "IPCA",
    "SELIC",
    "PREFIXADO",
    "IBOVESPA",
    "OUTRO",
  ];

  const usaIndicador = ["RENDA_FIXA", "RENDA_VARIAVEL", "FUNDOS"].includes(formData.tipo);
  const usaRentabilidade = formData.tipo === "RENDA_FIXA";

  useEffect(() => {
    if (investimento) {
      const contaSelecionada = contas.find((c) => c.id === investimento.conta?.id);
      setSaldoContaSelecionada(contaSelecionada?.saldo || 0);
      setFormData({
        idConta: String(investimento.conta?.id || ""),
        ativo: investimento.ativo || "",
        tipo: investimento.tipo || "RENDA_FIXA",
        valorInvestido: investimento.valorInvestido ? investimento.valorInvestido.toFixed(2) : "",
        percentual: String(investimento.percentual || ""),
        indicador: investimento.indicador || "CDI",
        dataAplicacao:
          investimento.dataAplicacao?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
    } else if (!loadingContas && contas.length > 0) {
      setSaldoContaSelecionada(contas[0].saldo || 0);
      setFormData((prev) => ({ ...prev, idConta: String(contas[0].id) }));
    }
  }, [investimento, contas, loadingContas]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    setErro(null);

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "tipo") {
        if (!["RENDA_FIXA", "RENDA_VARIAVEL", "FUNDOS"].includes(value)) {
          newData.indicador = "OUTRO";
        }
        if (value !== "RENDA_FIXA") {
          newData.percentual = "";
        }
      }

      return newData;
    });

    // Validação de Saldo da Conta
    if (name === "idConta") {
      const contaSelecionada = contas.find((c) => String(c.id) === value);
      setSaldoContaSelecionada(contaSelecionada?.saldo || 0);
    }

    if (name === "valorInvestido") {
      const valorSemMascara = parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
      if (valorSemMascara > saldoContaSelecionada) {
        setErro(`Saldo insuficiente. Saldo disponível: R$ ${saldoContaSelecionada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contaSelecionada = contas.find((c) => String(c.id) === formData.idConta);

      if (!contaSelecionada) {
        throw new Error("Conta não encontrada.");
      }

      let valorInvestidoLimpo = 0;
      if (formData.valorInvestido) {
        const valorSemPonto = formData.valorInvestido.replace(/\./g, "");
        const valorComPontoDec = valorSemPonto.replace(",", ".");
        valorInvestidoLimpo = parseFloat(valorComPontoDec);
      }

      if (!isEditMode && valorInvestidoLimpo > contaSelecionada.saldo) {
        setErro(`Saldo insuficiente. Saldo disponível: R$ ${contaSelecionada.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        return;
      }

      // Monta o payload respeitando as regras de negócio de cada tipo
      const payload = {
        conta: contaSelecionada,
        ativo: formData.ativo,
        tipo: formData.tipo,
        valorInvestido: valorInvestidoLimpo,
        percentual: usaRentabilidade ? parseFloat(formData.percentual) : 0,
        indicador: usaIndicador ? formData.indicador : "OUTRO",
        dataAplicacao: formData.dataAplicacao,
        ativoStatus: investimento ? investimento.ativoStatus : true,
      };

      if (isEditMode) {
        await updateInvestimento(investimento!.id, payload);
        toast.success("Investimento atualizado com sucesso!");
      } else {
        await createInvestimento(payload);
        toast.success("Investimento criado com sucesso!");
      }

      closeModal();
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar investimento.");
    }
  };

  const isLoading =
    criandoInvestimento || (isEditMode && atualizandoId === investimento?.id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-color)]/20 border border-[var(--border-color)] text-[var(--primary-color)] rounded-[var(--radius-md)]">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {isEditMode ? "Editar Investimento" : "Novo Investimento"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isEditMode
              ? "Altere os dados do seu investimento."
              : "Registre uma nova aplicação financeira."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {erro && (
          <div className="p-4 bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-xl text-sm font-medium">
            {erro}
          </div>
        )}

        <Input
          label="Nome do Ativo"
          name="ativo"
          value={formData.ativo}
          onChange={handleChange}
          placeholder="Ex: CDB Banco Inter, Bitcoin, Tesouro Direto"
          required
        />

        <Select
          label="Conta de Origem"
          name="idConta"
          value={formData.idConta}
          onChange={handleChange}
          disabled={loadingContas}
          required
        >
          <option value="" disabled>
            {loadingContas ? "Carregando..." : "Selecione uma conta"}
          </option>
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.instituicao} - R$ {conta.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </option>
          ))}
        </Select>

        {/* Linha Dinâmica: Tipo e Indicador (se aplicável) */}
        <div className={`grid gap-4 ${usaIndicador ? "grid-cols-2" : "grid-cols-1"}`}>
          <Select
            label="Tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          >
            {tiposInvestimento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.replace("_", " ")}
              </option>
            ))}
          </Select>
          
          {usaIndicador && (
            <Select
              label="Indicador"
              name="indicador"
              value={formData.indicador}
              onChange={handleChange}
            >
              {indicadores.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className={`grid gap-4 ${usaRentabilidade ? "grid-cols-2" : "grid-cols-1"}`}>
          {usaRentabilidade && (
            <Input
              label="Rentabilidade (%)"
              type="number"
              name="percentual"
              value={formData.percentual}
              onChange={handleChange}
              placeholder="Ex: 110"
              step="0.1"
              required
            />
          )}
          <Input
            label="Data da Aplicação"
            type="date"
            name="dataAplicacao"
            value={formData.dataAplicacao}
            onChange={handleChange}
            required
          />
        </div>

        {!isEditMode && (
          <Input
            label="Valor a Investir"
            type="number"
            isCurrency={true}
            name="valorInvestido"
            value={formData.valorInvestido}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={isLoading}
            className="cursor-pointer flex-1 px-4 py-3 text-[var(--text-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--bg-primary)] font-semibold transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading || !!erro}
            className="cursor-pointer flex-1 bg-[var(--primary-color)] text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] shadow-md hover:bg-[var(--primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Salvando..."
              : isEditMode
                ? "Salvar Alterações"
                : "Aplicar Investimento"}
          </button>
        </div>
      </form>
    </div>
  );
}