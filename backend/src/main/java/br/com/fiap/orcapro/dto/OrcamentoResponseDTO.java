package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Orcamento;

import java.math.BigDecimal;

public record OrcamentoResponseDTO(
        Long id,
        BigDecimal limite,
        Long categoriaId,
        String categoriaNome
) {
    public OrcamentoResponseDTO(Orcamento orcamento) {
        this(
                orcamento.getId(),
                orcamento.getLimite(),
                orcamento.getCategoria().getId(),
                orcamento.getCategoria().getNome()
        );
    }
}