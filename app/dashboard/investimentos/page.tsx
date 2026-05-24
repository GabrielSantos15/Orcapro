"use client";

import Button from "@/components/button/Button";
import Header from "@/components/header/Header";
import ListaInvestimentos from "@/components/widgets/ListaInvestimentos";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useModalStore } from "@/store/useModalStore";
import { Info } from "lucide-react";
import { useEffect } from "react";

export default function Investimentos() {
  const { investimentos, carregando, erro } = useInvestimentos();
  const { openModal } = useModalStore();

  if (carregando) {
    return (
      <div>
        <Header title="Meus Investimentos" />
        <p>Carregando investimentos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <Header title="Meus Investimentos" />
        <p style={{ color: "red" }}>Erro: {erro}</p>
      </div>
    );
  }

  return (
    <div>
      <Header title="Meus Investimentos" />

      <Button onClick={() => openModal("createInvestimento")}>
        + Adicionar Investimento
      </Button>
      <ListaInvestimentos investimentos={investimentos} onEdit={()=>{}} onAporte={()=>{}} onResgate={()=>{}}></ListaInvestimentos>
    </div>
  );
}
