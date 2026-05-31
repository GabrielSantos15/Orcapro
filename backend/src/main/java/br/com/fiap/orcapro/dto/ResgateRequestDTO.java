package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public record ResgateRequestDTO(
        BigDecimal valorResgatado,
        BigDecimal saldoRemanescente
) {}