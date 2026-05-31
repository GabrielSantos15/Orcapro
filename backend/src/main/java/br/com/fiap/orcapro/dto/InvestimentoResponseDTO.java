package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvestimentoResponseDTO(
        Long id,
        String ativo,
        String tipo,
        BigDecimal valorInvestido,
        BigDecimal percentual,
        String indicador,
        LocalDate dataAplicacao,
        Boolean ativoStatus,
        ContaResumoDTO conta
) {
}