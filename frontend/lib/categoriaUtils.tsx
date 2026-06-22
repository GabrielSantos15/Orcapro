import { 
  Landmark, 
  Briefcase, 
  TrendingUp, 
  Utensils, 
  CarFront, 
  Home, 
  Activity, 
  Gamepad2, 
  HelpCircle, 
  Coffee,
  ShoppingCart,
  BookOpen,
  Music,
  Film,
  Plane,
  DollarSign,
  Heart,
  Gift,
  Smartphone,
  Wrench
} from "lucide-react";
import { FaBullseye } from "react-icons/fa";
import React from "react";

// Função para normalizar string: minúsculas e sem acentos
const normalizar = (texto: string): string => {
  return texto
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase();
};

export const getIconeCategoria = (nome: string): React.ReactNode => {
  const mapaIcones: Record<string, React.ReactNode> = {
    "salario": <Landmark size={20} />,
    "freelance": <Briefcase size={20} />,
    "investimentos": <TrendingUp size={20} />,
    "metas": <FaBullseye size={20} />,
    "alimentacao": <Utensils size={20} />,
    "transporte": <CarFront size={20} />,
    "carro": <CarFront size={20} />,
    "moradia": <Home size={20} />,
    "casa": <Home size={20} />,
    "saude": <Activity size={20} />,
    "lazer": <Coffee size={20} />,
    "jogos": <Gamepad2 size={20} />,
    "compras": <ShoppingCart size={20} />,
    "educacao": <BookOpen size={20} />,
    "musica": <Music size={20} />,
    "filmes": <Film size={20} />,
    "viagem": <Plane size={20} />,
    "financas": <DollarSign size={20} />,
    "amor": <Heart size={20} />,
    "presentes": <Gift size={20} />,
    "presente": <Gift size={20} />,
    "tecnologia": <Smartphone size={20} />,
    "manutencao": <Wrench size={20} />,
    "outros": <HelpCircle size={20} />
  };

  const chave = normalizar(nome);
  return mapaIcones[chave] || (
    <span className="font-bold text-lg">
      {nome.charAt(0).toUpperCase()}
    </span>
  );
};

export const getCoresTipo = (tipo: string): string => {
  return tipo === "ENTRADA" 
    ? "bg-[var(--success-color)]/10 text-[var(--success-color)]" 
    : "bg-[var(--danger-color)]/10 text-[var(--danger-color)]";
};
