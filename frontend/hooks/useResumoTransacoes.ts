import { useCallback, useState } from "react";
import { ResumoCategoria } from "@/interfaces/ResumoCategoria";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";
import { ResumoAnual } from "@/interfaces/ResumoAnual";
import { FiltroResumoAnual } from "@/interfaces/FiltroResumoAnual";

export interface ResumoTransacoes {
  receitas: number;
  despesas: number;
  saldo: number;
  quantidadeTransacoes: number;
}

export function useResumoTransacoes() {
  const [erro, setErro] = useState<string | null>(null);

  // --- Estados do Resumo Geral ---
  const [resumo, setResumo] = useState<ResumoTransacoes>({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    quantidadeTransacoes: 0,
  });
  const [carregando, setCarregando] = useState(true);

  const [resumoCategorias, setResumoCategorias] = useState<ResumoCategoria[]>(
    [],
  );
  const [carregandoCategoria, setCarregandoCategoria] = useState(true);

  const [resumoAnual, setResumoAnual] = useState<ResumoAnual[]>([]);
  const [carregandoAnual, setCarregandoAnual] = useState(true);

  const carregarResumo = useCallback(async (filtros?: FiltroTransacao) => {
    setCarregando(true);
    setErro(null);

    try {
      const params = new URLSearchParams();

      if (filtros?.categoriaId)
        params.set("categoriaId", filtros.categoriaId.toString());
      if (filtros?.contaId) params.set("contaId", filtros.contaId.toString());
      if (filtros?.tipo) params.set("tipo", filtros.tipo);
      if (filtros?.dataInicio) params.set("dataInicio", filtros.dataInicio);
      if (filtros?.dataFim) params.set("dataFim", filtros.dataFim);

      const query = params.toString();
      const response = await fetch(
        `/api/transacao/resumo${query ? `?${query}` : ""}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar resumo");
      }

      const data = await response.json();

      setResumo({
        receitas: data.receitas ?? 0,
        despesas: data.despesas ?? 0,
        saldo: data.saldo ?? 0,
        quantidadeTransacoes: data.quantidadeTransacoes ?? 0,
      });
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar resumo");
    } finally {
      setCarregando(false);
    }
  }, []);

  const fetchResumoCategorias = useCallback(
    async (dataInicio: string, dataFim: string) => {
      try {
        setCarregandoCategoria(true);

        const params = new URLSearchParams();
        params.set("dataInicio", dataInicio);
        params.set("dataFim", dataFim);

        const res = await fetch(
          `/api/transacao/resumo/categorias?${params.toString()}`,
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || "Falha ao buscar resumo de categorias",
          );
        }

        const data = await res.json();
        setResumoCategorias(data);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setCarregandoCategoria(false);
      }
    },
    [],
  );

  const fetchResumoAnual = useCallback(async (filtros?: FiltroResumoAnual) => {
    try {
      setCarregandoAnual(true);

      const params = new URLSearchParams();
      if (filtros?.ano) params.set("ano", filtros.ano.toString());
      if (filtros?.contaId) params.set("contaId", filtros.contaId.toString());
      if (filtros?.tipo) params.set("tipo", filtros.tipo);
      if (filtros?.categoriaId)
        params.set("categoriaId", filtros.categoriaId.toString());

      const res = await fetch(
        `/api/transacao/resumo/anual?${params.toString()}`,
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao buscar resumo anual");
      }

      const data = await res.json();
      setResumoAnual(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregandoAnual(false);
    }
  }, []);

  return {
    erro,
    // Geral
    resumo,
    carregando,
    carregarResumo,
    // Categorias
    resumoCategorias,
    carregandoCategoria,
    fetchResumoCategorias,
    // Anual
    resumoAnual,
    carregandoAnual,
    fetchResumoAnual,
  };
}
