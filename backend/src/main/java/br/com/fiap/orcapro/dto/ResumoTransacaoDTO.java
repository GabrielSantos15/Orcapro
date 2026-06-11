package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;

public class ResumoTransacaoDTO {

    private BigDecimal receitas;
    private BigDecimal despesas;
    private BigDecimal saldo;
    private Long quantidadeTransacoes;

    public ResumoTransacaoDTO() {}

    public ResumoTransacaoDTO(
            BigDecimal receitas,
            BigDecimal despesas,
            BigDecimal saldo,
            Long quantidadeTransacoes
    ) {
        this.receitas = receitas;
        this.despesas = despesas;
        this.saldo = saldo;
        this.quantidadeTransacoes = quantidadeTransacoes;
    }

    // getters e setters
    public Long getQuantidadeTransacoes() {
        return quantidadeTransacoes;
    }

    public void setQuantidadeTransacoes(Long quantidadeTransacoes) {
        this.quantidadeTransacoes = quantidadeTransacoes;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getDespesas() {
        return despesas;
    }

    public void setDespesas(BigDecimal despesas) {
        this.despesas = despesas;
    }

    public BigDecimal getReceitas() {
        return receitas;
    }

    public void setReceitas(BigDecimal receitas) {
        this.receitas = receitas;
    }
}