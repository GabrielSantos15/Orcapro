import { Usuario } from "./Usuario"

export type TipoCategoria = "ENTRADA" | "SAIDA";

export interface Categoria{
   "id": number
    "usuario": Usuario
    "nome": string
    "tipo": "ENTRADA" | "SAIDA"
    "ativa": boolean
}