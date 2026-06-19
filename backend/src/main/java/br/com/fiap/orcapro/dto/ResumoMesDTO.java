package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public record ResumoMesDTO(
        String mesAno, // "01/2026"
        BigDecimal receitas,
        BigDecimal despesas,
        BigDecimal saldo
) {}