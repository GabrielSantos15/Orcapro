package br.com.fiap.orcapro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransacaoResponseDTO {

    private Long id;
    private String descricao;
    private String origemDestino;
    private BigDecimal valor;
    private LocalDate dataTransacao;

    private ContaResumoDTO conta;
    private CategoriaResumoDTO categoria;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getOrigemDestino() {
        return origemDestino;
    }

    public void setOrigemDestino(String origemDestino) {
        this.origemDestino = origemDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDate dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public ContaResumoDTO getConta() {
        return conta;
    }

    public void setConta(ContaResumoDTO conta) {
        this.conta = conta;
    }

    public CategoriaResumoDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaResumoDTO categoria) {
        this.categoria = categoria;
    }
}