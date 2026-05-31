package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Categoria;

public class CategoriaResumoDTO {

    private Long id;
    private String nome;
    private String tipo;

    public CategoriaResumoDTO(Categoria categoria) {
        this.id = categoria.getId();
        this.nome = categoria.getNome();
        this.tipo = categoria.getTipo().name();;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getTipo() {
        return tipo;
    }
}