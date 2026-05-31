package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public record ProgressoMetaRequestDTO(
        BigDecimal valor,
        Long contaId
) {
}