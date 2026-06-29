import { useMetas } from "@/hooks/useMetas";
import { formatarDiaMesAno, formatarMoeda } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { Target, Trash, Pencil, CheckCircle2, Trophy } from "lucide-react";

export default function ListaMetas() {
  const { metas, deletarMeta, carregando, calcularProgresso } = useMetas();
  const { openModal } = useModalStore();

  const metasOrdenadas = [...metas].sort((a, b) => {
    const progressoA = calcularProgresso(a.valorAtual, a.valorAlvo);
    const progressoB = calcularProgresso(b.valorAtual, b.valorAlvo);
    const isConcluidaA = progressoA >= 100;
    const isConcluidaB = progressoB >= 100;

    if (isConcluidaA && !isConcluidaB) return 1;
    if (!isConcluidaA && isConcluidaB) return -1;

    if (!a.dataLimite) return 1;  
    if (!b.dataLimite) return -1;

    return new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime();
  });

  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-20 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton w-8 h-8 rounded-lg" />
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-2">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-5 w-40 rounded" />
            </div>

            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-10 rounded" />
              </div>
              <div className="skeleton h-2.5 w-full rounded-full" />
            </div>

            {/* Botão */}
            <div className="skeleton h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }


  if (metas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl">
        <Target className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)]">Nenhuma meta definida</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Você ainda não possui aplicações cadastradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metasOrdenadas.map((meta) => {
        const progresso = calcularProgresso(meta.valorAtual, meta.valorAlvo);
        const concluida = progresso >= 100;

        return (
          <div
            key={meta.id}
            className={`
        rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5
        ${concluida
                ? "bg-gradient-to-br from-[var(--bg-surface)] to-green-500/5 border-green-500/20"
                : "bg-[var(--bg-surface)] border-[var(--border-color)]"}
      `}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className={`
              p-2.5 rounded-xl
              ${concluida
                      ? "bg-green-500/10 text-green-500"
                      : "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"}
            `}
                >
                  {concluida ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                      {meta.nome}
                    </h3>

                    {concluida && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-500">
                        Concluída
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    {meta.dataLimite
                      ? formatarDiaMesAno(meta.dataLimite)
                      : "Sem data"}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => openModal("updateMeta", meta)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--color-info)] hover:bg-[var(--color-info)]/10 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deletarMeta(meta.id)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--danger-color)] hover:bg-[var(--danger-color)]/10 rounded-lg transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Valores */}
            <div>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">
                Total Acumulado
              </p>

              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {formatarMoeda(meta.valorAtual)}
                <span className="text-sm font-normal text-[var(--text-muted)] ml-1">
                  / {formatarMoeda(meta.valorAlvo)}
                </span>
              </p>
            </div>

            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--text-muted)]">
                  {concluida ? <p className="text-sm text-green-500 font-medium flex gap-2">
                    <Trophy className="w-4 h-4" /> Meta atingida
                  </p> : "Progresso"}
                </span>

                <span
                  className={
                    concluida
                      ? "text-green-500"
                      : "text-[var(--primary-color)]"
                  }
                >
                  {progresso.toFixed(0)}%
                </span>
              </div>

              <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden">
                <div
                  className={`
              h-full rounded-full transition-all duration-500
              ${concluida
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_8px_rgba(34,197,94,.5)]"
                      : "bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] shadow-[0_0_8px_var(--primary-color)]"}
            `}
                  style={{ width: `${Math.min(progresso, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => openModal("meta", meta)}
              className="mt-2 w-full py-2 text-sm font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--border-color)] transition-all flex items-center justify-center gap-2"
            >
              {concluida ? "Ver Resultado" : "Gerenciar Meta"}
            </button>
          </div>
        );
      })}
    </div>
  );
}