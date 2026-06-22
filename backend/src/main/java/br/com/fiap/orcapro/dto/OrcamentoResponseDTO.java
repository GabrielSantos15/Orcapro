package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Orcamento;

import java.math.BigDecimal;

public record OrcamentoResponseDTO(
        Long id,
        BigDecimal limite,
        CategoriaResumoDTO categoria
) {
    public OrcamentoResponseDTO(Orcamento orcamento) {
        this(
                orcamento.getId(),
                orcamento.getLimite(),
                new CategoriaResumoDTO(orcamento.getCategoria())
        );
    }
}