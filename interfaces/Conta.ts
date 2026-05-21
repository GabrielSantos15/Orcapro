import { Usuario } from "./Usuario"

export interface Conta {
  "id": number
  "usuario": Usuario
  "instituicao": string
  "tipo": string
  "saldo": number
}