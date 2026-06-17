import { 
  Landmark, 
  Briefcase, 
  TrendingUp, 
  Utensils, 
  CarFront, 
  Home, 
  Activity, 
  Gamepad2, 
  HelpCircle 
} from "lucide-react";
import { FaBullseye } from "react-icons/fa";
import React from "react";

export const getIconeCategoria = (nome: string): React.ReactNode => {
  const mapaIcones: Record<string, React.ReactNode> = {
    "Salário": <Landmark size={20} />,
    "Freelance": <Briefcase size={20} />,
    "Investimentos": <TrendingUp size={20} />,
    "Metas": <FaBullseye size={20} />,
    "Alimentação": <Utensils size={20} />,
    "Transporte": <CarFront size={20} />,
    "Moradia": <Home size={20} />,
    "Saúde": <Activity size={20} />,
    "Lazer": <Gamepad2 size={20} />,
    "Outros": <HelpCircle size={20} />
  };

  return mapaIcones[nome] || <span className="font-bold text-lg">{nome.charAt(0).toUpperCase()}</span>;
};

export const getCoresTipo = (tipo: string): string => {
  return tipo === "ENTRADA" 
    ? "bg-[var(--success-color)]/10 text-[var(--success-color)]" 
    : "bg-[var(--danger-color)]/10 text-[var(--danger-color)]";
};