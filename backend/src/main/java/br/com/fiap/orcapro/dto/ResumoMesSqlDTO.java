package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public record ResumoMesSqlDTO(
        Integer mes,
        BigDecimal receitas,
        BigDecimal despesas
) {
    // Esse bloco roda sozinho toda vez que o banco devolve uma linha
    public ResumoMesSqlDTO {
        if (receitas == null) receitas = BigDecimal.ZERO;
        if (despesas == null) despesas = BigDecimal.ZERO;
    }
}