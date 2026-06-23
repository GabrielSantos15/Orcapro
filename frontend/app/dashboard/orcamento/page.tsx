'use client'

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button/Button";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import FiltersOrcamento from "@/components/filters/FiltersOrcamento";
import ListaOrcamentos from "@/components/widgets/ListaOrcamentos";
import ListaGastosNaoPlanejados from "@/components/widgets/ListaGastosNaoPlanejados";
import WidgetContainer from "@/components/widgets/WidgetContainer";

import { useModalStore } from "@/store/useModalStore";
import { obterDatasMesAtual } from "@/lib/utils";
import { useResumoTransacoes } from "@/hooks/useResumoTransacoes";
import { FiltroTransacao } from "@/interfaces/FiltroTransacao";

export default function Orcamento() {
  // Mantemos apenas a função de fetch, já que os dados não são renderizados diretamente aqui
  const { fetchResumoCategorias } = useResumoTransacoes();
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

  return (
    <main>
      <HeaderDashboard
        title="Orçamentos"
        subTitle="Controle seus limites de gastos e defina metas de recebimentos"
      />

      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <FiltersOrcamento
          filtro={filtro}
          setFiltro={setFiltro}
          onClear={handleClear}
        />
        
        <Button
          className="w-full lg:w-auto shrink-0 shadow-sm"
          onClick={() => openModal("createOrcamento")}
        >
          + Adicionar Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Listas Principais */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <section>
            <WidgetContainer titulo="Limites de Gasto (Saídas)">
              <ListaOrcamentos tipo="SAIDA"  filtro={filtro}/>
            </WidgetContainer>
          </section>
          
          <section>
            <WidgetContainer titulo="Metas de Ganho (Entradas)">
              <ListaOrcamentos tipo="ENTRADA" filtro={filtro}/>
            </WidgetContainer>
          </section>
        </div>

        <div className="lg:col-span-4 h-fit sticky top-6">
          <ListaGastosNaoPlanejados filtro={filtro} />
        </div>
      </div>
      
    </main>
  );
}