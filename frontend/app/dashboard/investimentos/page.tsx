"use client";

import Button from "@/components/button/Button";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaInvestimentos from "@/components/widgets/ListaInvestimentos";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useModalStore } from "@/store/useModalStore";
import { Info } from "lucide-react";
import { useEffect } from "react";

export default function Investimentos() {

  const { openModal } = useModalStore();

  return (
    <>
      <HeaderDashboard title="Meus Investimentos" />

      <Button
        className="w-full md:w-fit mb-4"
        onClick={() => openModal("createInvestimento")}
      >
        + Adicionar Investimento
      </Button>
      {/* BANNER INFORMATIVO */}
      <div className="flex items-start gap-3 p-4 bg-blue-200/10 backdrop-blur-2xl border border-blue-500 rounded-xl mb-4">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-500">
            Sobre o saldo dos investimentos
          </h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
            Seu dinheiro pode render diariamente. Caso o valor real na sua
            corretora esteja diferente do registrado aqui, clique no ícone de
            recarregar ao lado do saldo para sincronizar e manter seu patrimônio
            atualizado!
          </p>
        </div>
      </div>
      <ListaInvestimentos
      ></ListaInvestimentos>
    </>
  );
}
