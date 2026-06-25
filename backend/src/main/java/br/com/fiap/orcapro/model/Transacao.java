package br.com.fiap.orcapro.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "t_transacao")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transacao")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conta", nullable = false)
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(name = "nm_origem_destino", length = 100)
    private String origemDestino;

    @Column(name = "ds_transacao", length = 255)
    private String descricao;

    @Column(name = "vl_transacao", nullable = false)
    private BigDecimal valor;

    @Column(name = "dt_transacao")
    private LocalDate dataTransacao;

    public Transacao() {
    }

    public Transacao(Long id, Conta conta, Categoria categoria, String origemDestino,
                     String descricao, BigDecimal valor, LocalDate dataTransacao) {
        this.id = id;
        this.conta = conta;
        this.categoria = categoria;
        this.origemDestino = origemDestino;
        this.descricao = descricao;
        this.valor = valor;
        this.dataTransacao = dataTransacao;
    }

    public Transacao(Conta conta, Categoria categoria, String origemDestino,
                     String descricao, BigDecimal valor, LocalDate dataTransacao) {
        this.conta = conta;
        this.categoria = categoria;
        this.origemDestino = origemDestino;
        this.descricao = descricao;
        this.valor = valor;
        this.dataTransacao = dataTransacao;
    }

    public Transacao(Conta conta, Categoria categoria, String origemDestino,
                     String descricao, BigDecimal valor) {
        this.conta = conta;
        this.categoria = categoria;
        this.origemDestino = origemDestino;
        this.descricao = descricao;
        this.valor = valor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getOrigemDestino() {
        return origemDestino;
    }

    public void setOrigemDestino(String origemDestino) {
        this.origemDestino = origemDestino;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
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
}