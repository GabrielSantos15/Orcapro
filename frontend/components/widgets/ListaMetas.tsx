import { useMetas } from "@/hooks/useMetas";
import { useUtils } from "@/hooks/useUtils";
import { useModalStore } from "@/store/useModalStore";
import {
  Target,
  TrendingUp,
  Trash2,
  Pencil,
  Zap,
  Plus,
  Minus,
} from "lucide-react";

export default function ListaMetas() {
  const { metas, deletarMeta, carregando, calcularProgresso } = useMetas();
  const { openModal } = useModalStore();
  const { formatarMoeda } = useUtils();

  const getCorProgresso = (percentual: number) => {
    if (percentual >= 100) return "bg-green-500";
    if (percentual >= 75) return "bg-blue-500";
    if (percentual >= 50) return "bg-yellow-500";
    return "bg-[var(--primary-color)]";
  };

  const getCorTextoStatus = (percentual: number) => {
    // Pesos ajustados para 500 para melhor leitura no Light e Dark mode
    if (percentual >= 100) return "text-green-500";
    if (percentual >= 75) return "text-blue-500";
    if (percentual >= 50) return "text-yellow-500";
    return "text-[var(--primary-color)]";
  };

  // 1. Estado de Carregamento (Skeleton Super Fiel ao Layout)
  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col h-full min-h-[380px]"
          >
            {/* Header: Ícone, Textos e Botões de Ação (Lápis/Lixeira) */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl skeleton shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-3/4 h-4 skeleton rounded-md" />
                  <div className="w-1/3 h-3 skeleton rounded-md" />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="w-7 h-7 skeleton rounded-lg" />
                <div className="w-7 h-7 skeleton rounded-lg" />
              </div>
            </div>

            {/* Descrição Fantasma */}
            <div className="w-full h-3 skeleton rounded-md mb-5" />

            {/* Valores Principais */}
            <div className="mb-4 flex-grow">
              <div className="w-20 h-3 skeleton rounded-md mb-2" />
              <div className="w-32 h-8 skeleton rounded-md mb-5" />

              {/* Barra de Progresso Fantasma */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-16 h-3 skeleton rounded-md" />
                  <div className="w-8 h-4 skeleton rounded-md" />
                </div>
                <div className="w-full h-2.5 skeleton rounded-full" />
              </div>

              {/* Valor Limite (Meta) */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <div className="w-10 h-3 skeleton rounded-md" />
                <div className="w-24 h-5 skeleton rounded-md" />
              </div>
            </div>

            {/* Status Badge (Alcançada / Faltam X) */}
            <div className="pt-4 border-t border-[var(--border-color)] mb-4">
              <div className="w-full h-9 skeleton rounded-lg" />
            </div>

            {/* Botões de Ação Inferiores (Sacar / Guardar) */}
            <div className="flex gap-3 mt-auto">
              <div className="flex-1 h-9 skeleton rounded-lg" />
              <div className="flex-1 h-9 skeleton rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Estado Vazio
  if (metas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl col-span-full">
        <Target className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)]">Nenhuma meta definida</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">Crie sua primeira meta financeira para começar a poupar.</p>
      </div>
    );
  }

  // 3. Renderização Real
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metas.map((meta) => {
        const progresso = calcularProgresso(meta.valorAtual, meta.valorAlvo);
        
        return (
          <div
            key={meta.id}
            className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm transition-all hover:shadow-md flex flex-col h-full min-h-[380px]"
          >
            {/* Header com nome e ações */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-500/10 shrink-0">
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] leading-tight truncate">
                    {meta.nome}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {meta.dataLimite}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal("updateMeta", meta)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletarMeta(meta.id)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Descrição */}
            {meta.descricao && (
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                {meta.descricao}
              </p>
            )}

            {/* Valores */}
            <div className="mb-4 flex-grow">
              <p className="text-xs text-[var(--text-muted)] mb-1 uppercase font-semibold">
                Valor Atual
              </p>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {formatarMoeda(meta.valorAtual)}
              </h2>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    Progresso
                  </span>
                  <span
                    className={`text-sm font-bold ${getCorTextoStatus(progresso)}`}
                  >
                    {progresso.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getCorProgresso(progresso)}`}
                    style={{ width: `${Math.min(progresso, 100)}%` }}
                  />
                </div>
              </div>

              {/* Valor Limite */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <span className="text-sm text-[var(--text-secondary)]">Meta</span>
                <span className="text-lg font-bold text-[var(--text-primary)]">
                  {formatarMoeda(meta.valorAlvo)}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t border-[var(--border-color)] mb-4">
              {progresso >= 100 ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold truncate">Meta Alcançada!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold truncate">
                    Faltam {formatarMoeda(meta.valorAlvo - meta.valorAtual)}
                  </span>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => openModal("resgateMeta", meta)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-colors font-medium text-sm"
              >
                <Minus className="w-4 h-4" />
                Sacar
              </button>
              <button
                onClick={() => openModal("addProgressoMeta", meta)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}