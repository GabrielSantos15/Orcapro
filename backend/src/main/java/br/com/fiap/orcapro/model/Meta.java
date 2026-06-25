package br.com.fiap.orcapro.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_meta")
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_meta")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "nm_meta", nullable = false, length = 100)
    private String nome;

    @Column(name = "ds_meta", length = 255)
    private String descricao;

    @Column(name = "vl_objetivo", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorAlvo;

    @Column(name = "vl_atual", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO;

    @Column(name = "dt_limite")
    private LocalDate dataLimite;

    // Aponte para a coluna st_meta que já existe
    @Column(name = "st_meta", nullable = false)
    private Boolean concluida = false;

    public Meta() {
    }

    public Meta(Long id, Usuario usuario, String nome, String descricao,
                BigDecimal valorAlvo, BigDecimal valorAtual, LocalDate dataLimite, Boolean concluida) {
        this.id = id;
        this.usuario = usuario;
        this.nome = nome;
        this.descricao = descricao;
        this.valorAlvo = valorAlvo;
        this.valorAtual = valorAtual;
        this.dataLimite = dataLimite;
        this.concluida = concluida;
    }

    public Meta(Usuario usuario, String nome, String descricao,
                BigDecimal valorAlvo, BigDecimal valorAtual, LocalDate dataLimite, Boolean concluida) {
        this.usuario = usuario;
        this.nome = nome;
        this.descricao = descricao;
        this.valorAlvo = valorAlvo;
        this.valorAtual = valorAtual;
        this.dataLimite = dataLimite;
        this.concluida = concluida;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorAlvo() {
        return valorAlvo;
    }

    public void setValorAlvo(BigDecimal valorAlvo) {
        this.valorAlvo = valorAlvo;
    }

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
    }

    public Boolean getConcluida() {
        return concluida;
    }

    public void setConcluida(Boolean concluida) {
        this.concluida = concluida;
    }
}