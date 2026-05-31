package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public record AtualizarSaldoRequestDTO(
        BigDecimal novoSaldo
) {
}