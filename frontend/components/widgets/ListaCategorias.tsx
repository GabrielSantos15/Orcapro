"use client";
import { useState, useMemo } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useCategorias } from "@/hooks/useCategorias";
import { toast } from "sonner";
import { Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { getCoresTipo, getIconeCategoria } from "@/lib/categoriaUtils";

type FiltroTipo = "TODAS" | "ENTRADA" | "SAIDA";

export default function ListaCategorias() {
  const { openModal } = useModalStore();
  // Adicionado o 'carregando' extraído do hook
  const { categorias, carregando, deletarCategoria, reativarCategoria } = useCategorias();

  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("TODAS");
  const [busca, setBusca] = useState("");
  const [mostrarInativas, setMostrarInativas] = useState(false);

  const categoriasFiltradas = useMemo(() => {
    return categorias
      .filter((c) => c.nome !== "Outros") 
      .filter((c) => (mostrarInativas ? true : c.ativa !== false))
      .filter((c) => (filtroTipo === "TODAS" ? true : c.tipo === filtroTipo)) 
      .filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase())); 
  }, [categorias, filtroTipo, busca, mostrarInativas]);

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja desativar esta categoria?")) {
      try {
        await deletarCategoria(id);
        toast.success("Categoria desativada com sucesso!");
      } catch (err) {
        toast.error("Erro ao desativar categoria. Tente novamente.");
      }
    }
  };

  const handleReativar = async (id: number) => {
    try {
      if (reativarCategoria) {
        await reativarCategoria(id);
        toast.success("Categoria reativada com sucesso!");
      } else {
        toast.error("Função de reativar não encontrada no hook.");
      }
    } catch (err) {
      toast.error("Erro ao reativar categoria.");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 p-5">
      
      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <input
          type="text"
          placeholder="Buscar categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
        />
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          {(["TODAS", "ENTRADA", "SAIDA"] as FiltroTipo[]).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
                filtroTipo === tipo
                  ? "bg-[var(--primary-color)] text-white shadow-md"
                  : "bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tipo === "TODAS" ? "Todas" : tipo === "ENTRADA" ? "Entradas" : "Saídas"}
            </button>
          ))}
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={mostrarInativas}
              onChange={(e) => setMostrarInativas(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
          </div>
          <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
            Mostrar inativas
          </span>
        </label>
      </div>

      {/* ÁREA DA TABELA */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* CABEÇALHO DA TABELA (THEAD) */}
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="pb-3 px-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Nome da Categoria
              </th>
              <th className="pb-3 px-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">
                Tipo
              </th>
              <th className="pb-3 px-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">
                Ações
              </th>
            </tr>
          </thead>
          
          {/* CORPO DA TABELA (TBODY) */}
          <tbody>
            {carregando ? (
              // SKELETON LOADING DA TABELA
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={`skeleton-${i}`} className="border-b border-[var(--border-color)] last:border-0">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 skeleton rounded-lg flex-shrink-0" />
                      <div className="w-32 h-4 skeleton rounded-md" />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center align-middle">
                    <div className="w-16 h-5 skeleton rounded-full mx-auto" />
                  </td>
                  <td className="py-3 px-2 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-8 h-8 skeleton rounded-lg" />
                      <div className="w-8 h-8 skeleton rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : categoriasFiltradas.length === 0 ? (
              // MENSAGEM DE TABELA VAZIA
              <tr>
                <td colSpan={3} className="py-8 text-center">
                  <p className="text-sm font-medium text-[var(--text-muted)]">
                    {categorias.length === 0 
                      ? "Nenhuma categoria cadastrada." 
                      : "Nenhuma categoria encontrada para estes filtros."}
                  </p>
                </td>
              </tr>
            ) : (
              // LISTAGEM DE CATEGORIAS
              categoriasFiltradas.map((c) => {
                const isInactive = c.ativa === false;
                const corTema = getCoresTipo(c.tipo);

                return (
                  <tr
                    key={c.id}
                    onClick={() => !isInactive && openModal("updateCategoria", c)} 
                    className={`group border-b border-[var(--border-color)] last:border-0 transition-colors ${
                      isInactive 
                        ? "bg-[var(--bg-secondary)]/30 opacity-70" 
                        : "hover:bg-[var(--bg-secondary)]/40 cursor-pointer"
                    }`}
                  >
                    {/* ESQUERDA: Ícone e Nome */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex flex-shrink-0 items-center justify-center shadow-sm ${
                          isInactive ? "bg-[var(--border-color)]/30 text-[var(--text-muted)] grayscale" : corTema
                        }`}>
                          {getIconeCategoria(c.nome)}
                        </div>
                        <div className="flex flex-col">
                          <p className={`font-medium text-sm truncate ${isInactive ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>
                            {c.nome}
                          </p>
                          {isInactive && (
                            <span className="text-[10px] text-[var(--danger-color)] uppercase tracking-wider font-bold mt-0.5">
                              Desativada
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* CENTRO: Pílula de Tipo */}
                    <td className="py-3 px-2 text-center align-middle">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        isInactive ? "bg-[var(--border-color)]/30 text-[var(--text-muted)]" : corTema
                      }`}>
                        {c.tipo}
                      </span>
                    </td>

                    {/* DIREITA: Ações */}
                    <td className="py-3 px-2 align-middle">
                      <div className="flex items-center justify-end gap-1">
                        {isInactive ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleReativar(c.id);
                            }}
                            className="flex items-center justify-center w-8 h-8 text-[var(--text-muted)] hover:bg-[var(--success-color)]/10 hover:text-[var(--success-color)] rounded-lg transition-colors cursor-pointer"
                            title="Reativar categoria"
                          >
                            <RotateCcw size={16} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); 
                                openModal("updateCategoria", c);
                              }}
                              className="flex items-center justify-center w-8 h-8 text-[var(--text-muted)] hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)] rounded-lg transition-colors cursor-pointer"
                              title="Editar categoria"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleDelete(c.id);
                              }}
                              className="flex items-center justify-center w-8 h-8 text-[var(--text-muted)] hover:bg-[var(--danger-color)]/10 hover:text-[var(--danger-color)] rounded-lg transition-colors cursor-pointer"
                              title="Desativar categoria"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}