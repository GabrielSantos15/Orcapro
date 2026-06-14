package br.com.fiap.orcapro.dto;

public record AlterarSenhaRequestDTO(
        String senhaAtual,
        String novaSenha
) {
}