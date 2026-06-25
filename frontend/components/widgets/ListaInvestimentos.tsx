"use client";

import { useModalStore } from "@/store/useModalStore";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import {
  TrendingUp,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Pencil,
  Landmark,
  CircleDollarSign,
  Bitcoin,
  Info,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function ListaInvestimentos() {
  const { openModal } = useModalStore();
  const { investimentos, carregando, erro, deletarInvestimento } = useInvestimentos();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case "RENDA_FIXA":
        return <Landmark className="w-5 h-5 text-blue-500" />;
      case "RENDA_VARIAVEL":
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "CRIPTOMOEDAS":
        return <Bitcoin className="w-5 h-5 text-orange-500" />;
      default:
        return <CircleDollarSign className="w-5 h-5 text-purple-500" />;
    }
  };

  const getCorFundoTipo = (tipo: string) => {
    switch (tipo) {
      case "RENDA_FIXA":
        return "bg-blue-500/10";
      case "RENDA_VARIAVEL":
        return "bg-emerald-500/10";
      case "CRIPTOMOEDAS":
        return "bg-orange-500/10";
      default:
        return "bg-purple-500/10";
    }
  };

  // Nova função: Mapeia o brilho exato para cada cor no Dark Mode
  const getGlowTipo = (tipo: string) => {
    switch (tipo) {
      case "RENDA_FIXA":
        return "dark:shadow-[0_0_15px_rgba(59,130,246,0.45)]"; // Blue
      case "RENDA_VARIAVEL":
        return "dark:shadow-[0_0_15px_rgba(16,185,129,0.45)]"; // Emerald
      case "CRIPTOMOEDAS":
        return "dark:shadow-[0_0_15px_rgba(249,115,22,0.45)]"; // Orange
      default:
        return "dark:shadow-[0_0_15px_rgba(168,85,247,0.45)]"; // Purple
    }
  };

  // ==========================================
  // ESTADOS DA UI (Early Returns)
  // ==========================================

  if (carregando) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-5 shadow-sm flex flex-col h-full min-h-[250px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl skeleton shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-2/3 h-4 skeleton rounded-md" />
                    <div className="w-1/3 h-3 skeleton rounded-md" />
                  </div>
                </div>
                <div className="w-7 h-7 skeleton rounded-lg shrink-0" />
              </div>

              <div className="mb-6 flex-grow">
                <div className="w-32 h-3 skeleton rounded-md mb-2" />
                <div className="w-40 h-8 skeleton rounded-md mb-3" />
                <div className="w-24 h-6 skeleton rounded-md mt-3" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-color)]">
                <div className="w-full h-9 skeleton rounded-lg" />
                <div className="w-full h-9 skeleton rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!investimentos || investimentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-surface)] rounded-2xl border border-dashed border-[var(--border-color)]">
        <Wallet className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          Nenhum investimento encontrado
        </h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Você ainda não possui aplicações cadastradas.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investimentos.map((inv) => (
        <article
          key={inv.id}
          className={`relative bg-[var(--bg-surface)] rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col ${
            !inv.ativoStatus ? "opacity-75 grayscale-[0.5] border-[var(--border-color)]" : "border-[var(--border-color)]"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl transition-shadow duration-300 ${getCorFundoTipo(inv.tipo)} ${inv.ativoStatus ? getGlowTipo(inv.tipo) : ""}`}
              >
                {getIconeTipo(inv.tipo)}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] leading-tight">
                  {inv.ativo}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {inv.conta?.instituicao}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!inv.ativoStatus && (
                <span className="px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[10px] font-bold rounded-full uppercase">
                  Inativo
                </span>
              )}
              <button
                onClick={() => openModal("updateInvestimento", inv)}
                className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-6 flex-grow">
            <p className="text-sm text-[var(--text-muted)] mb-1">
              Saldo Atual Registrado
            </p>
            <div className="flex items-center gap-2">
              <h2
                className={`text-2xl font-bold tracking-tight ${
                  !inv.ativoStatus ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                }`}
              >
                {formatarMoeda(inv.valorInvestido)}
              </h2>

              {inv.ativoStatus && (
                <button
                  onClick={() => openModal("updateSaldoInvestimento", inv)}
                  className="p-1 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                  title="Atualizar rendimento"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-500 text-xs font-semibold rounded-md">
                <TrendingUp className="w-3 h-3" />
                {inv.percentual > 0 && <span>{inv.percentual}%</span>} {inv.indicador}
              </span>
            </div>
          </div>

          {inv.ativoStatus ? (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => openModal("resgateInvestimento", inv)}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowDownCircle className="w-4 h-4" /> Resgatar
              </button>
              <button
                onClick={() => openModal("aporteInvestimento", inv)}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[var(--primary-color)]/10 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/20 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowUpCircle className="w-4 h-4" /> Aportar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => deletarInvestimento(inv.id)}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Deletar
              </button>
              <button
                onClick={() => openModal("aporteInvestimento", inv)}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowUpCircle className="w-4 h-4" /> Reativar
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}