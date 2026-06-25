package br.com.fiap.orcapro.model;

import br.com.fiap.orcapro.enums.TipoCategoria;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "t_categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"nome", "email", "senha", "dtCadastro"})
    private Usuario usuario;

    @Column(name = "nm_categoria", nullable = false, length = 50)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "tp_categoria", nullable = false, length = 20)
    private TipoCategoria tipo;

    @Column(name = "st_ativa")
    private Boolean ativa;

    public Categoria() {
    }

    public Categoria(Long id,
                     Usuario usuario,
                     String nome,
                     TipoCategoria tipo,
                     Boolean ativa) {

        this.id = id;
        this.usuario = usuario;
        this.nome = nome;
        this.tipo = tipo;
        this.ativa = ativa;
    }

    public Categoria(Usuario usuario,
                     String nome,
                     TipoCategoria tipo,
                     Boolean ativa) {

        this.usuario = usuario;
        this.nome = nome;
        this.tipo = tipo;
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoCategoria getTipo() {
        return tipo;
    }

    public void setTipo(TipoCategoria tipo) {
        this.tipo = tipo;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }
}