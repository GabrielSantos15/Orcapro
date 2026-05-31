package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Conta;

import java.math.BigDecimal;

public class ContaResponseDTO {

    private Long id;
    private String instituicao;
    private String tipo;
    private BigDecimal saldo;
    private Boolean ativa;

    public ContaResponseDTO(Conta conta) {
        this.id = conta.getId();
        this.instituicao = conta.getInstituicao();
        this.tipo = conta.getTipo();
        this.saldo = conta.getSaldo();
        this.ativa = conta.getAtiva();
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public Long getId() {
        return id;
    }

    public String getInstituicao() {
        return instituicao;
    }

    public String getTipo() {
        return tipo;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }
}