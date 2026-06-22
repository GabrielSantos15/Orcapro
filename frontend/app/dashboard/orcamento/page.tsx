'use client'

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button/Button";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import FiltersOrcamento from "@/components/filters/FiltersOrcamento";
import ListaOrcamentos from "@/components/widgets/ListaOrcamentos"; // <-- Seu novo componente
import { useOrcamentos } from "@/hooks/useOrcamento";
import { useModalStore } from "@/store/useModalStore";
import { obterDatasMesAtual } from "@/lib/utils";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";
import GastosNaoPlanejados from "@/components/widgets/ListaGastosNaoPlanejados";
import ListaGastosNaoPlanejados from "@/components/widgets/ListaGastosNaoPlanejados";
import WidgetContainer from "@/components/widgets/WidgetContainer";

export default function Orcamento() {
  // Nota: Assumindo que o seu useOrcamentos() busca TODOS os orçamentos misturados
  const { orcamentos, carregando, deletarOrcamento } = useOrcamentos();
  const { resumoCategorias, fetchResumoCategorias, carregandoCategoria } = useResumoTransacoes();
  const { openModal, atualizarGatilho } = useModalStore();

  const [filtro, setFiltro] = useState<FiltroTransacao>(obterDatasMesAtual);
  const filtroRef = useRef(filtro);
  filtroRef.current = filtro;

  const carregarResumo = (filtroAtual: FiltroTransacao) => {
    if (filtroAtual.dataInicio && filtroAtual.dataFim) {
      fetchResumoCategorias(filtroAtual.dataInicio, filtroAtual.dataFim);
    }
  };

  useEffect(() => {
    carregarResumo(filtroRef.current);
  }, [atualizarGatilho]);

  const handleApply = () => carregarResumo(filtro);
  const handleClear = () => {
    const filtroResetado = obterDatasMesAtual();
    setFiltro(filtroResetado);
    carregarResumo(filtroResetado);
  };

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const isLoading = carregando || carregandoCategoria;

  // Lógica dos Gastos sem Orçamento
  const orcamentosIds = orcamentos.map((o) => o.categoria.id);
  const gastosSemOrcamento = resumoCategorias.filter(
    (r) => !orcamentosIds.includes(r.categoriaId) && r.totalGasto > 0 // Ignora zerados
  );

  return (
    <main>
      <HeaderDashboard
        title="Orçamentos"
        subTitle="Controle seus limites de gastos e defina metas de recebimentos"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="mt-6 mb-8">
          <FiltersOrcamento
            filtro={filtro}
            setFiltro={setFiltro}
            onApply={handleApply}
            onClear={handleClear}
          />
        </div>
        <Button
          className="w-full md:w-fit"
          onClick={() => openModal("createOrcamento")}
        >
          + Adicionar Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-8">

          <section>
            <WidgetContainer titulo="Limites de Gasto (Saídas)">
              <ListaOrcamentos
                tipo="SAIDA"
              />
            </WidgetContainer>
          </section>
          <section>
            <WidgetContainer titulo="Metas de Ganho (Entradas)">
              <ListaOrcamentos
                tipo="ENTRADA"
              />
            </WidgetContainer>
          </section>
        </div>
        <div className="lg:col-span-4 h-fit sticky top-6">
          <ListaGastosNaoPlanejados />
        </div>
      </div>
    </main>
  );
}