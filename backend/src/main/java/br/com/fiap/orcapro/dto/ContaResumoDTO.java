package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Conta;

public class ContaResumoDTO {
    private Long id;
    private String instituicao;

    public ContaResumoDTO(Conta conta) {
        this.id = conta.getId();
        this.instituicao = conta.getInstituicao();
    }

    public Long getId() {
        return id;
    }

    public String getInstituicao() {
        return instituicao;
    }
}