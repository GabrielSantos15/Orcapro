"use client";
import { useUtils } from "@/hooks/useUtils";
import { Meta } from "@/interfaces/Meta";
import { formatarMoeda } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { Target, TrendingUp, Minus, Plus, Info } from "lucide-react";

interface ViewMetaModalProps {
  meta: Meta;
}

export default function ViewMetaModal({ meta }: ViewMetaModalProps) {
  const { openModal } = useModalStore();
  const progresso = (meta.valorAtual / meta.valorAlvo) * 100;
  
  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="p-3 rounded-2xl bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
          <Target className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{meta.nome}</h2>
          <p className="text-sm text-[var(--text-muted)]">Data alvo: {meta.dataLimite}</p>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-[var(--primary-color)]">
          <Info size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Sobre esta meta</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {meta.descricao || "Nenhuma descrição fornecida para esta meta."}
        </p>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Valor Atual</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{formatarMoeda(meta.valorAtual)}</p>
        </div>
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Meta Alvo</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{formatarMoeda(meta.valorAlvo)}</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Progresso total</span>
          <span className="font-bold text-[var(--primary-color)]">{progresso.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-3 ">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] dark:shadow-[0_0_10px_var(--primary-color)]"
            style={{ width: `${Math.min(progresso, 100)}%` }}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => openModal("resgateMeta",meta)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500/10 text-orange-500 font-bold rounded-xl hover:bg-orange-500/20 transition-all"
        >
          <Minus size={18} /> Sacar
        </button>
        <button
          onClick={() => openModal("addProgressoMeta",meta)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-500 font-bold rounded-xl hover:bg-green-500/20 transition-all"
        >
          <Plus size={18} /> Guardar
        </button>
      </div>
    </div>
  );
}