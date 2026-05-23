import { Usuario } from "./Usuario"

export interface Categoria{
   "id": number
    "usuario": Usuario
    "nome": string
    "tipo": "ENTRADA" | "SAIDA"
    "ativa": number
}