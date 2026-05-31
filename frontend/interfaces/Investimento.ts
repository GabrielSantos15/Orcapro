import { Conta } from "./Conta";
import { Usuario } from "./Usuario";

export interface Investimento {
  id: number;
  usuario: Usuario;
  conta: Conta;
  ativo: string;
  tipo: string;
  valorInvestido: number;
  percentual: number;
  indicador: string;
  dataAplicacao: string;
  ativoStatus: boolean;
}