package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MetaResponseDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal valorAlvo,
        BigDecimal valorAtual,
        LocalDate dataLimite,
        Boolean concluida
) {
}