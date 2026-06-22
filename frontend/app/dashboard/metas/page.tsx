"use client";

import Button from "@/components/button/Button";
import { MetaCard } from "@/components/cards/cardMeta";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaMetas from "@/components/widgets/ListaMetas";
import { useMetas } from "@/hooks/useMetas";
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

export default function Metas() {
  const { openModal } = useModalStore();


  return (
    <>
      <HeaderDashboard title="Minhas Metas" />
      <Button
        className="w-full md:w-fit mb-4"
        onClick={() => openModal("createMeta")}
      >
        + Adicionar Meta
      </Button>
      <ListaMetas></ListaMetas>

    </>
  );
}
