package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.AlterarSenhaRequestDTO;
import br.com.fiap.orcapro.dto.CadastroUsuarioDTO;
import br.com.fiap.orcapro.dto.UsuarioResponseDTO;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ======================================================
    // ROTAS PÚBLICAS
    // ======================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO salvar(@Valid @RequestBody CadastroUsuarioDTO dto) {
        Usuario novoUsuario = dto.toEntity();
        return usuarioService.salvar(novoUsuario);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> login(
            @RequestBody Map<String, String> credenciais
    ) {

        return usuarioService.login(
                credenciais.get("email"),
                credenciais.get("senha")
        );
    }

    // ======================================================
    // ROTAS DO USUÁRIO LOGADO
    // ======================================================

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponseDTO buscarPerfil(
            @RequestHeader("Authorization") String token
    ) {

        return usuarioService.buscarPerfil(
                token.substring(7)
        );
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponseDTO atualizarPerfil(
            @RequestBody Usuario usuario,
            @RequestHeader("Authorization") String token
    ) {

        return usuarioService.atualizarPerfil(
                usuario,
                token.substring(7)
        );
    }

    @PutMapping("/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarSenha(
            @RequestBody AlterarSenhaRequestDTO payload,
            @RequestHeader("Authorization") String token
    ) {
        usuarioService.alterarSenha(
                payload.senhaAtual(),
                payload.novaSenha(),
                token.substring(7)
        );
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirPerfil(
            @RequestHeader("Authorization") String token
    ) {

        usuarioService.excluirPerfil(
                token.substring(7)
        );
    }
}