package br.com.fiap.orcapro.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "t_conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conta")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "nm_instituicao", nullable = false, length = 50)
    private String instituicao;

    @Column(name = "tp_conta", nullable = false, length = 20)
    private String tipo;

    @Column(name = "vl_saldo")
    private BigDecimal saldo;

    @Column(name = "st_ativa")
    private Boolean ativa = true;

    public Conta() {
    }

    public Conta(Long id, Usuario usuario, String instituicao, String tipo, BigDecimal saldo, Boolean ativa) {
        this.id = id;
        this.usuario = usuario;
        this.instituicao = instituicao;
        this.tipo = tipo;
        this.saldo = saldo;
        this.ativa = ativa;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }

    public Conta(Usuario usuario, String instituicao, String tipo, BigDecimal saldo, Boolean ativa) {
        this.usuario = usuario;
        this.instituicao = instituicao;
        this.tipo = tipo;
        this.saldo = saldo;
        this.ativa = ativa;
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

    public String getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(String instituicao) {
        this.instituicao = instituicao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
}