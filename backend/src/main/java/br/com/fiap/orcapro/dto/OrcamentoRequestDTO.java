package br.com.fiap.orcapro.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record OrcamentoRequestDTO(

        @NotNull(message = "A categoria é obrigatória")
        Long categoriaId,

        @NotNull(message = "O limite é obrigatório")
        @Positive(message = "O limite deve ser maior que zero")
        BigDecimal limite
) {
}