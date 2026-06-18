package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.enums.TipoCategoria;
import java.math.BigDecimal;

public record ResumoCategoriaDTO(
        Long categoriaId,
        String nomeCategoria,
        TipoCategoria tipoCategoria,
        BigDecimal totalGasto,
        Long quantidadeTransacoes
) {}