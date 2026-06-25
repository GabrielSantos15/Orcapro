package br.com.fiap.orcapro.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "t_usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nm_usuario", nullable = false, length = 100)
    private String nome;

    @Column(name = "ds_email", nullable = false, length = 100,unique = true)
    private String email;

    @Column(name = "ds_senha", nullable = false, length = 255)
    private String senha;

    @Column(
            name = "dt_cadastro",
            insertable = false,
            updatable = false
    )
    private LocalDateTime dtCadastro;

    public Usuario() {
    }

    public Usuario(Long id, String nome, String email, String senha, LocalDateTime dtCadastro) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dtCadastro = dtCadastro;
    }

    public Usuario(Long id, String nome, String email, String senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDateTime getDtCadastro() {
        return dtCadastro;
    }

    public void setDtCadastro(LocalDateTime dtCadastro) {
        this.dtCadastro = dtCadastro;
    }
}
