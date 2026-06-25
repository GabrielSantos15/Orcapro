package br.com.fiap.orcapro.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_investimento")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_investimento")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conta", nullable = false)
    private Conta conta;

    @Column(name = "nm_ativo", nullable = false, length = 100)
    private String ativo;

    @Column(name = "tp_ativo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "vl_investido", nullable = false)
    private BigDecimal valorInvestido;

    @Column(name = "rt_percentual")
    private BigDecimal percentual;

    @Column(name = "ds_indicador", length = 20)
    private String indicador;

    @Column(name = "dt_aplicacao", nullable = false)
    private LocalDate dataAplicacao;

    @Column(name = "st_ativo", nullable = false)
    private Boolean ativoStatus = true;

    public Investimento() {
    }

    public Investimento(
            Long id,
            Usuario usuario,
            Conta conta,
            String ativo,
            String tipo,
            BigDecimal valorInvestido,
            BigDecimal percentual,
            String indicador,
            LocalDate dataAplicacao,
            Boolean ativoStatus
    ) {
        this.id = id;
        this.usuario = usuario;
        this.conta = conta;
        this.ativo = ativo;
        this.tipo = tipo;
        this.valorInvestido = valorInvestido;
        this.percentual = percentual;
        this.indicador = indicador;
        this.dataAplicacao = dataAplicacao;
        this.ativoStatus = ativoStatus;
    }

    public Investimento(
            Usuario usuario,
            Conta conta,
            String ativo,
            String tipo,
            BigDecimal valorInvestido,
            BigDecimal percentual,
            String indicador,
            LocalDate dataAplicacao,
            Boolean ativoStatus
    ) {
        this.usuario = usuario;
        this.conta = conta;
        this.ativo = ativo;
        this.tipo = tipo;
        this.valorInvestido = valorInvestido;
        this.percentual = percentual;
        this.indicador = indicador;
        this.dataAplicacao = dataAplicacao;
        this.ativoStatus = ativoStatus;
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

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public String getAtivo() {
        return ativo;
    }

    public void setAtivo(String ativo) {
        this.ativo = ativo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValorInvestido() {
        return valorInvestido;
    }

    public void setValorInvestido(BigDecimal valorInvestido) {
        this.valorInvestido = valorInvestido;
    }

    public BigDecimal getPercentual() {
        return percentual;
    }

    public void setPercentual(BigDecimal percentual) {
        this.percentual = percentual;
    }

    public String getIndicador() {
        return indicador;
    }

    public void setIndicador(String indicador) {
        this.indicador = indicador;
    }

    public LocalDate getDataAplicacao() {
        return dataAplicacao;
    }

    public void setDataAplicacao(LocalDate dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public Boolean getAtivoStatus() {
        return ativoStatus;
    }

    public void setAtivoStatus(Boolean ativoStatus) {
        this.ativoStatus = ativoStatus;
    }
}