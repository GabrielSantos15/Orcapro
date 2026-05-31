import { useMetas } from "@/hooks/useMetas";
import { useUtils } from "@/hooks/useUtils";
import { Meta } from "@/interfaces/Meta";
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

interface ListaMetasPropos {
  metas: Meta[];
  compacto?: boolean;
}

export default function ListaMetas({
  metas,
  compacto = false,
}: ListaMetasPropos) {
  const { openModal } = useModalStore();
  const { calcularProgresso, deletarMeta } = useMetas();
  const { formatarMoeda } = useUtils();

  const gridClassName = compacto
    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const getCorProgresso = (percentual: number) => {
    if (percentual >= 100) return "bg-green-500";
    if (percentual >= 75) return "bg-blue-500";
    if (percentual >= 50) return "bg-yellow-500";
    return "bg-[var(--primary-color)]";
  };

  const getCorTextoStatus = (percentual: number) => {
    if (percentual >= 100) return "text-green-600";
    if (percentual >= 75) return "text-blue-600";
    if (percentual >= 50) return "text-yellow-600";
    return "text-[var(--primary-color)]";
  };

  return (
    <div className={gridClassName}>
      {metas.map((meta) => {
        const progresso = calcularProgresso(meta.valorAtual, meta.valorAlvo);

        return (
          <div
            key={meta.id}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md flex flex-col"
          >
            {/* Header com nome e ações */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 rounded-xl bg-purple-50">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {meta.nome}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    {meta.dataLimite}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal("updateMeta", meta)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletarMeta(meta.id)}
                  className="p-1.5 text-gray-400 hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Descrição */}
            {meta.descricao && (
              <p className="text-sm text-gray-600 mb-4">{meta.descricao}</p>
            )}

            {/* Valores */}
            <div className="mb-4 flex-grow">
              <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">
                Valor Atual
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {formatarMoeda(meta.valorAtual)}
              </h2>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600 font-medium">
                    Progresso
                  </span>
                  <span
                    className={`text-sm font-bold ${getCorTextoStatus(progresso)}`}
                  >
                    {progresso.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getCorProgresso(progresso)}`}
                    style={{ width: `${Math.min(progresso, 100)}%` }}
                  />
                </div>
              </div>

              {/* Valor Limite */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">Meta</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatarMoeda(meta.valorAlvo)}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t border-gray-100 mb-4">
              {progresso >= 100 ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Meta Alcançada!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Faltam {formatarMoeda(meta.valorAlvo - meta.valorAtual)}
                  </span>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button
                onClick={() => openModal("resgateMeta", meta)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm"
              >
                <Minus className="w-4 h-4" />
                Sacar
              </button>
              <button
                onClick={() => openModal("addProgressoMeta", meta)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
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
