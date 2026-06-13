type FiltroTransacao = {
  categoriaId?: number;
  contaId?: number;
  tipo?: "ENTRADA" | "SAIDA";
  dataInicio?: string;
  dataFim?: string;
};