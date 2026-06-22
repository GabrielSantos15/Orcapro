import { Categoria, TipoCategoria } from "./Categoria";

export interface Orcamento {
  id: number;
  limite: number;
  categoria: Categoria
}

export interface OrcamentoRequest {
  categoriaId: number; 
  limite: number;
}