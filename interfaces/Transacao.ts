import { Categoria } from "./Categoria";
import { Conta } from "./Conta";

export interface Transacao {
  "id": number;
  "conta": Conta;
  "categoria": Categoria;
  "origemDestino": string;
  "descricao": string;
  "valor": number;
  "dataTransacao": string;
}
