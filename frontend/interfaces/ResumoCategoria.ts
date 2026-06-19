export interface ResumoCategoria {
  categoriaId: number;
  nomeCategoria: string;
  tipoCategoria: "ENTRADA" | "SAIDA";
  totalGasto: number;
  quantidadeTransacoes: number;
}