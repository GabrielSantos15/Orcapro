package br.com.fiap.orcapro.dto;

import br.com.fiap.orcapro.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroUsuarioDTO(

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail com formato inválido")
        String email,

        // 👇 AQUI ESTÁ A VERIFICAÇÃO DA SENHA! 👇
        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String senha
) {
    // Método para converter o DTO para a sua Entidade
    public Usuario toEntity() {
        return new Usuario(this.nome, this.email, this.senha);
    }
}